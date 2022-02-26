export class Card {
  id: number | undefined;
  value: number | undefined;
  url: string | undefined;
  isOpen: boolean;

  constructor(id: number, value: number, url: string, isOpen: boolean) {
    this.id = id;
    this.value = value;
    this.url = url;
    this.isOpen = isOpen;
  }
}
