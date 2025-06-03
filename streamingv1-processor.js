class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();

    const { sampleRate } = options.processorOptions || {};
    this.sourceSampleRate = sampleRate || 48000; // default fallback
    this.downsampleRatio = this.sourceSampleRate / 16000;

    this.recording = false;
    this.buffer = [];

    this.port.onmessage = (event) => {
      if (event.data.type === 'start') {
        this.recording = true;
      } else if (event.data.type === 'stop') {
        this.recording = false;
      }
    };
  }

  floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  downsample(buffer, ratio) {
    if (ratio === 1) return buffer;
    const length = Math.floor(buffer.length / ratio);
    const result = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const start = Math.floor(i * ratio);
      const end = Math.floor((i + 1) * ratio);
      let sum = 0;
      for (let j = start; j < end && j < buffer.length; j++) {
        sum += buffer[j];
      }
      result[i] = sum / (end - start);
    }
    return result;
  }

  process(inputs) {
    if (!this.recording) return true;

    const input = inputs[0];
    if (!input || input.length === 0) return true;

    const channelData = input[0];
    if (!channelData) return true;

    const downsampled = this.downsample(channelData, this.downsampleRatio);
    const int16 = this.floatTo16BitPCM(downsampled);

    this.port.postMessage({ type: 'pcm', buffer: int16.buffer }, [int16.buffer]);
    return true;
  }
}

registerProcessor('streamingv1-processor', PCMProcessor);
