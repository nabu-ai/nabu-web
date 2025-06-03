class RecordingProcessorSt1 extends AudioWorkletProcessor {
    constructor() {
      super();
      this.port.onmessage = (event) => {
        if (event.data === 'START') this.recording = true;
        else if (event.data === 'STOP') this.recording = false;
      };
    }
  
    process(inputs) {
      if (!this.recording) return true;
  
      const input = inputs[0];
      if (input.length > 0 && input[0].length > 0) {
        const floatSamples = input[0];
        const pcm16 = new Int16Array(floatSamples.length);
        for (let i = 0; i < floatSamples.length; i++) {
          const s = Math.max(-1, Math.min(1, floatSamples[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        this.port.postMessage(pcm16);
      }
  
      return true;
    }
  }
  
  registerProcessor('recording-processor-st1', RecordingProcessorSt1);
  