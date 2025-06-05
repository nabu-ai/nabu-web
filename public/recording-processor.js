// Based on sample from 
// https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/src/audio-worklet/migration/worklet-recorder/recording-processor.js

class RecordingProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.sampleRate = 0;
    this.maxRecordingFrames = 0;
    this.numberOfChannels = 0;

    if (options && options.processorOptions) {
      const {
        numberOfChannels,
        sampleRate,
        maxFrameCount,
      } = options.processorOptions;

      this.sampleRate = sampleRate;
      this.maxRecordingFrames = maxFrameCount;
      this.numberOfChannels = numberOfChannels;
    }

    this._recordingBuffer = new Array(this.numberOfChannels)
        .fill(null)
        .map(() => new Float32Array(this.maxRecordingFrames));

    this.recordedFrames = 0;
    this.isRecording = false;
    this.framesSinceLastPublish = 0;
    this.publishInterval = this.sampleRate * 5;
    this.silenceFrame = new Float32Array(128); // 128 samples of silence

    this.port.onmessage = (event) => {
      if (event.data.message === 'UPDATE_RECORDING_STATE') {
        this.isRecording = event.data.setRecording;
      }
    };
  }

  process(inputs, outputs) {
    const inputChannels = inputs[0];
    const outputChannels = outputs[0];

    for (let channel = 0; channel < this.numberOfChannels; channel++) {
      const input = inputChannels[channel] || this.silenceFrame;
      const output = outputChannels[channel];

      for (let sample = 0; sample < input.length; sample++) {
        const currentSample = this.isRecording ? input[sample] : 0.0;

        if (this.isRecording) {
          this._recordingBuffer[channel][sample + this.recordedFrames] = currentSample;
        }

        output[sample] = currentSample;
      }
    }

    const shouldPublish = this.framesSinceLastPublish >= this.publishInterval;

    if (this.isRecording) {
      if (this.recordedFrames + 128 < this.maxRecordingFrames) {
        this.recordedFrames += 128;

        if (shouldPublish) {
          this.port.postMessage({
            message: 'SHARE_RECORDING_BUFFER',
            buffer: this._recordingBuffer,
            recordingLength: this.recordedFrames
          });
          this.framesSinceLastPublish = 0;
          this.recordedFrames = 0;
        } else {
          this.framesSinceLastPublish += 128;
        }
      } else {
        this.recordedFrames += 128;
        this.port.postMessage({
          message: 'SHARE_RECORDING_BUFFER',
          buffer: this._recordingBuffer,
          recordingLength: this.recordedFrames
        });
        this.recordedFrames = 0;
        this.framesSinceLastPublish = 0;
      }
    } else {
      // Stream silence if not recording
      for (let channel = 0; channel < this.numberOfChannels; channel++) {
        const output = outputChannels[channel];
        for (let i = 0; i < output.length; i++) {
          output[i] = 0.0;
        }
      }
    }

    return true;
  }
}

registerProcessor('recording-processor', RecordingProcessor);
