import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ChatContext {
  utilisateurId: string | null;
  lastIntent: string | null;
  lastKeyword: string | null;
  lastLocation: string | null;
}

interface ChatResponse {
  response: string;
  context: ChatContext;
  options: string[]; // Peut être vide mais jamais null ou undefined
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  messages: { sender: string; text: string }[] = [];
  utilisateurId: string | null = null;
  isChatOpen: boolean = false;
  suggestions: string[] = [];
  context: ChatContext = {
    utilisateurId: null,
    lastIntent: null,
    lastKeyword: null,
    lastLocation: null,
  };
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.utilisateurId = localStorage.getItem('utilisateurId') || null;
    this.context.utilisateurId = this.utilisateurId;
    this.http.get<string[]>(`${this.apiUrl}/suggestions`).subscribe({
      next: (suggestions) => {
        this.suggestions = Array.isArray(suggestions) ? suggestions : [];
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des suggestions :',
          error
        );
        this.suggestions = [];
      },
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.sendToBackend('');
    }
  }

  sendOption(option: string): void {
    this.messages = [];
    this.messages.push({ sender: 'Vous', text: option });
    this.sendToBackend(option);
  }

  private sendToBackend(message: string): void {
    console.log('Envoi au backend :', message);
    this.http
      .post<ChatResponse>(this.apiUrl, {
        message,
        utilisateurId: this.utilisateurId,
        context: this.context,
      })
      .subscribe({
        next: (response) => {
          console.log('Réponse du backend :', response);

          // Sécurité : vérifier que response est bien défini et conforme
          if (!response || typeof response.response !== 'string') {
            this.messages.push({
              sender: 'Bot',
              text: 'Erreur : réponse invalide du serveur.',
            });
            return;
          }

          // Mise à jour du contexte si présent
          if (response.context) {
            this.context = response.context;
          }

          // Affichage du message bot
          this.messages.push({ sender: 'Bot', text: response.response });

          // Mise à jour des suggestions en s'assurant que c'est un tableau
          if (Array.isArray(response.options)) {
            this.suggestions = response.options;
          } else {
            this.suggestions = [];
          }
        },
        error: (error) => {
          console.error('Erreur HTTP :', error);
          this.messages.push({
            sender: 'Bot',
            text: 'Erreur : Impossible de contacter le serveur.',
          });
        },
      });
  }

  formatMessage(text: string): SafeHtml {
    console.log('Formatage du message :', text);
    if (!text || text.trim() === '') {
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p>Aucune information disponible.</p>'
      );
    }

    const lines = text.split('\n');
    let formattedMessage = '';

    for (const line of lines) {
      if (!line || line.trim() === '') continue; // Ignorer les lignes vides
      if (line.trim().startsWith('- ')) {
        const offerText = line.substring(2).trim();
        const escapedOfferText = this.escapeHtml(offerText);
        formattedMessage += `<div class="offer-card">${escapedOfferText}</div>`;
      } else {
        const escapedLine = this.escapeHtml(line.trim());
        formattedMessage += `<p>${escapedLine}</p>`;
      }
    }

    console.log('Message formaté :', formattedMessage);
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      formattedMessage || '<p>Message vide.</p>'
    );
    console.log('SafeHtml généré :', safeHtml);
    return safeHtml;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
}
