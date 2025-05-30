export class AudioQueue {
  private queue: HTMLAudioElement[] = [];
  private isPlaying = false;

  enqueue(audio: HTMLAudioElement): void {
    this.queue.push(audio);
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  private async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audio = this.queue.shift()!;

    try {
      await this.playAudio(audio);
    } catch (err) {
      console.error("Failed to play audio:", err);
    }

    this.playNext();
  }

  private playAudio(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }
}
