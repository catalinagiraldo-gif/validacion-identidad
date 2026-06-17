import { Injectable, signal } from '@angular/core';

// Tipos para Web Speech API
type SpeechRecognitionEvent = any;
type SpeechRecognitionErrorEvent = any;
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((ev: Event) => void) | null;
  onstart: ((ev: Event) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class GaliVoiceService {
  readonly isRecording = signal(false);
  readonly transcript = signal('');
  readonly interimTranscript = signal('');
  readonly waveformLevels = signal<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  readonly available = signal(this.checkAvailable());
  readonly error = signal<string | null>(null);

  private recognition: SpeechRecognition | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrame: number | null = null;

  private checkAvailable(): boolean {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }

  async start() {
    if (this.isRecording()) return;
    this.error.set(null);
    this.transcript.set('');
    this.interimTranscript.set('');

    // Web Speech Recognition
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      this.error.set('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    this.recognition = new SR() as SpeechRecognition;
    this.recognition.lang = 'es-CO';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isRecording.set(true);
    };

    this.recognition.onresult = (ev: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) this.transcript.set(this.transcript() + finalText);
      this.interimTranscript.set(interimText);
    };

    this.recognition.onerror = (ev: SpeechRecognitionErrorEvent) => {
      this.error.set(`Error de voz: ${ev.error}`);
      this.cleanup();
    };

    this.recognition.onend = () => {
      this.cleanup();
    };

    try {
      this.recognition.start();
      // Empezamos waveform real con MediaDevices
      await this.startWaveform();
    } catch (e) {
      this.error.set(`No pudimos arrancar el micrófono: ${(e as Error).message}`);
      this.cleanup();
    }
  }

  stop() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
    }
    this.cleanup();
  }

  private async startWaveform() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const tick = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        // 8 buckets sobre 16 frecuencias
        const levels: number[] = [];
        const bucketSize = Math.floor(dataArray.length / 8);
        for (let i = 0; i < 8; i++) {
          let sum = 0;
          for (let j = 0; j < bucketSize; j++) sum += dataArray[i * bucketSize + j];
          levels.push(Math.min(1, (sum / bucketSize) / 200));
        }
        this.waveformLevels.set(levels);
        this.animationFrame = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      // Si fallaron permisos de mic, igual deja la transcripción funcionando si fue concedida via SR
      console.warn('No se pudo arrancar waveform:', e);
    }
  }

  private cleanup() {
    this.isRecording.set(false);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
    this.recognition = null;
    this.waveformLevels.set([0, 0, 0, 0, 0, 0, 0, 0]);
  }

  finalText(): string {
    return (this.transcript() + ' ' + this.interimTranscript()).trim();
  }
}
