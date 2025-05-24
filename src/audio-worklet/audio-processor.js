class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isProcessing = false;
  }

  process(inputs, outputs, parameters) {
    // Always return true to keep the processor running
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor); 