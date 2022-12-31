import {Component, OnInit} from '@angular/core';
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {Card} from "../model/card";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AppComponent implements OnInit {
  cards: Card[] = [];
  selectedCard: number[] = [];
  position: string = '';

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.buildMessageDialog('Welcome to Memory Cards Game',
      'Do you want to play? just click on yes to start game',
       'middle');
  }

  async evaluate(card: Card) {
    card.isOpen = true;
    if (this.selectedCard.length < 2 && card.value != null) {
      this.selectedCard.push(card.value);
    }

    if (this.selectedCard.length == 2) {
      if (this.selectedCard[0] === this.selectedCard[1]) {
        this.messageService.add({severity: 'success', summary: 'Point', detail: 'Match cards'});
        this.cards = <any>await this.dismissSameCards();
      } else {
        this.messageService.add({severity: 'error', summary: 'Opps!', detail: 'Cards selected are different'});
        <any>await this.downAllCards();
      }
    }

    if (!this.cards.length) {
      this.buildMessageDialog('Memory Cards Game', 'Do you want to play again? just click on yes to start game', 'middle');
    }
  }

  generateCards() {
    this.selectedCard = [];
    this.cards = [];
    let cardsGenerated = true;

    while (cardsGenerated) {
      const valueCard = Math.floor(Math.random() * (3)) + 1;
      if (this.cards.filter(card => card.value == valueCard).length < 2) {
        this.cards.push(new Card(this.cards.length + 1, valueCard, '/assets/images/' + valueCard + '.jpeg', false));
      }

      if (this.cards.length == 6) {
        cardsGenerated = false;
      }
    }
  }

  dismissSameCards() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.cards.filter(card => card.value !== this.selectedCard[0]));
        this.selectedCard = [];
      }, 2000);
    });
  }

  downAllCards() {
    return new Promise(() => {
      setTimeout(() => {
        this.cards.forEach((card) => {
          card.isOpen = false;
        })
        this.selectedCard = [];
      }, 2000);
    });
  }

  buildMessageDialog(header: string, message: string, position: string) {
    this.position = position;
    this.confirmationService.confirm({
      header: header,
      message: message,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.generateCards();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
      },
      key: "positionDialog"
    });
  }
}
