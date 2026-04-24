# UC-006: Text-to-Speech (TTS) - Audio Alternative for Content

**Related PRD/TRD**: [PRD-013](../prd/PRD-013-text-to-speech.md)

**Actors**: Visually impaired users, Multitaskers, Language learners

---

## Preconditions

- User is viewing a reading passage
- User's browser supports Web Audio API and Web Speech API
- User has audio enabled on device

## Main Flow

1. User clicks TTS Player button (speaker icon) in reader controls
2. System displays TTSPlayer component with:
   - Play/Pause button
   - Voice selector dropdown (e.g., "Spanish Female", "English Male", etc.)
   - Speed slider (0.5x to 2.0x rate)
   - Auto-Play toggle
3. User selects desired voice from dropdown
4. User adjusts speed slider if desired
5. User clicks Play or enables Auto-Play
6. System extracts current slide text and constructs speech queue
7. Browser Web Speech API begins synthesizing text to audio
8. Audio plays through device speakers; system highlights current sentence being spoken
9. User can follow along visually and/or listen passively
10. User hears entire slide read aloud
11. When slide complete, system either stops or auto-advances (if that's enabled) and reads next slide
12. User can pause, resume, or skip by pressing buttons

## Postcondition

- Content is accessible via audio
- User can consume content without relying on visual reading
- Voice and speed preferences are remembered (if authenticated)
- Sentence highlighting helps users follow along

## Related Features

- Auto-Advance Timer: Can pause auto-advance while TTS is speaking to avoid conflicts
- Accessibility Suite: Pairs with screen readers for fully accessible experience
- Language: TTS voice selection includes multiple languages (supports i18n roadmap)

---

## Variants

### Variant: Multi-language Support

1. User opens reading with original Spanish text
2. User opens TTS Player
3. User selects "Spanish Female (Castilian)" from voice dropdown
4. System plays Spanish text in Spanish voice
5. Reading can include translated sections; user selects appropriate voice for each section

---

← [Back to Use Cases Index](README.md)
