
class SilenceDetectorProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const {
      silenceThreshold = 0.01,
      silenceDuration = 300,
      sampleRate = 8000
    } = options.processorOptions || {};

    this.threshold = silenceThreshold;
    this.timeout = silenceDuration;
    this.sampleRate = sampleRate;

    this.frameCount = 0;
    this.lastVoiceMs = 0;
    this.wasSilent = false;
  }

  getCurrentTimeMs() {
    return (this.frameCount / this.sampleRate) * 1000;
  }

  process(inputs) {
    const input = inputs[0][0];
    if (!input) return true;

    this.frameCount += input.length;

    let sum = 0;
    const pcm16 = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = input[i];
      pcm16[i] = Math.max(-32768, Math.min(32767, s * 32768));
      sum += s * s;
    }

    const rms = Math.sqrt(sum / input.length);
    const now = this.getCurrentTimeMs();

    //this.port.postMessage({ type: "rms", payload: rms });

    if (rms > this.threshold) {
      
      this.lastVoiceMs = now;
      if (this.wasSilent) {
        // console.log("RMS::::", rms, " threshold is::", this.threshold)
        this.port.postMessage({ type: "speaking" });
        this.wasSilent = false;
      }
      this.port.postMessage({ type: "pcm", payload: pcm16.buffer }, [pcm16.buffer]);
    } else {
      if ((now - this.lastVoiceMs) > this.timeout && !this.wasSilent) {
        this.port.postMessage({ type: "silence" });
        this.wasSilent = true;
      }
    }

    return true;
  }
}

registerProcessor("silence-detector", SilenceDetectorProcessor);
