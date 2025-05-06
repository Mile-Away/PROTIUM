package main

type Deck struct {
	DeckID    string `json:"deck_id"`
	Shuffled  bool   `json:"shuffled"`
	CardsLeft int    `json:"cards_left"`
}

type Card struct {
	CardID string `json:"card_id"`
	Value  string `json:"value"`
	Suit   string `json:"suit"`
}

func (d Deck) String() string {
	return d.DeckID
}
