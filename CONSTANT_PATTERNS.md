# Constant Declaration Patterns

This document analyzes different patterns for declaring and using constants (like waveforms, easing types, etc.) in p5.modulate.

## 1. Enum-like Object
```typescript
const Waveform = {
  Sine: 0,
  Square: 1,
  Saw: 2,
  Triangle: 3
} as const;
```

### Pros
- Simple JavaScript object, no TypeScript-specific features required
- Can be easily added to p5 prototype
- Values can be any type (numbers, strings, etc.)
- Good IDE support for property completion
- Can be extended by users if needed
- Familiar to JavaScript developers

### Cons
- No type safety by default (needs TypeScript's `as const`)
- Values can be mutated unless frozen
- No automatic value assignment
- No reverse mapping (value to key)
- Less formal than TypeScript enums

## 2. Individual Constants
```typescript
const SINE = 'lfo-sine';
const SQUARE = 'lfo-square';
const SAW = 'lfo-saw';
const TRIANGLE = 'lfo-triangle';
```

### Pros
- Very simple and straightforward
- No nesting or object structure to navigate
- Easy to tree-shake unused constants
- Clear and explicit
- Works well with JavaScript modules

### Cons
- No grouping of related constants
- Can pollute the namespace
- No automatic completion of related values
- Harder to iterate over all possible values
- Less structured than other options

## 3. TypeScript Enum
```typescript
enum Waveform {
  Sine,
  Square,
  Saw,
  Triangle
}
```

### Pros
- Full type safety
- Automatic value assignment
- Reverse mapping support
- Great IDE support
- Can't be modified after declaration

### Cons
- TypeScript-specific feature
- Generates more JavaScript code
- Less familiar to JavaScript developers
- Can't be extended at runtime
- Not common in p5.js ecosystem

## 4. Symbol-based Constants
```typescript
const Waveform = {
  Sine: Symbol('sine'),
  Square: Symbol('square'),
  Saw: Symbol('saw'),
  Triangle: Symbol('triangle')
} as const;
```

### Pros
- Guaranteed unique values
- Can't be forged or tampered with
- Good for internal implementation
- Type safe when used with TypeScript
- Clear developer intent

### Cons
- Not serializable
- Less beginner-friendly
- Harder to debug (in console)
- Not common in p5.js ecosystem
- Overkill for simple constants

## 5. String Literal Union Types (TypeScript)
```typescript
type Waveform = 'sine' | 'square' | 'saw' | 'triangle';
const WAVEFORMS: Record<Waveform, Waveform> = {
  sine: 'sine',
  square: 'square',
  saw: 'saw',
  triangle: 'triangle'
};
```

### Pros
- Type safe
- Self-documenting
- String values are easy to debug
- Good IDE support
- Works well with JSON

### Cons
- TypeScript-specific
- More verbose than other options
- Requires type definitions
- May be confusing for beginners
- Not common in p5.js ecosystem

## Looking at p5.js Conventions

p5.js consistently uses individual constants, even for related values. The pattern is:
1. Individual constants with descriptive names in UPPER_SNAKE_CASE
2. String or numeric values depending on use case
3. Constants are added to p5 prototype when they need to be globally accessible
4. Related constants are grouped by comments but not in objects

Examples from p5.js:
```javascript
// Angle constants
export const DEGREES = 'degrees';
export const RADIANS = 'radians';
export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;

// Shape constants
export const CORNER = 'corner';
export const CORNERS = 'corners';
export const RADIUS = 'radius';

// Rendering constants
export const BLEND = 'source-over';
export const REMOVE = 'destination-out';
export const ADD = 'lighter';
```

## Recommendation

Based on p5.js's actual patterns and conventions, the **Individual Constants** pattern (Option 2) is recommended because:

1. Follows p5.js conventions exactly
2. Simple and straightforward
3. Easy to understand and use
4. No nesting or complex structures
5. Clear and explicit
6. Works well with both JavaScript and TypeScript

### Example Implementation
```typescript
// Waveform constants
export const WAVE_SINE = 'sine';
export const WAVE_SQUARE = 'square';
export const WAVE_SAW = 'saw';
export const WAVE_TRIANGLE = 'triangle';

// Add to p5 prototype
p5.prototype.WAVE_SINE = WAVE_SINE;
p5.prototype.WAVE_SQUARE = WAVE_SQUARE;
p5.prototype.WAVE_SAW = WAVE_SAW;
p5.prototype.WAVE_TRIANGLE = WAVE_TRIANGLE;

// Type definition (if needed)
export type WaveformType = 
  | typeof WAVE_SINE 
  | typeof WAVE_SQUARE 
  | typeof WAVE_SAW 
  | typeof WAVE_TRIANGLE;
```

### Usage
```typescript
// Global mode
let lfo = createLfo({ waveform: WAVE_SINE });

// Instance mode
function sketch(p) {
  let lfo = p.createLfo({ waveform: p.WAVE_SINE });
}
```

### Benefits of This Approach
1. Direct alignment with p5.js conventions
2. Simpler than enum-like objects
3. Easy to add new constants
4. Clear documentation through grouping comments
5. Straightforward TypeScript integration
6. No unnecessary abstraction layers

### Considerations
When using this pattern:
1. Group related constants with clear comments
2. Use UPPER_SNAKE_CASE for constant names
3. Use abbreviated prefixes to:
   - Avoid conflicts with existing p5.js functions (e.g., `WAVE_SQUARE` vs `square()`)
   - Indicate the constant's context (e.g., `WAVE_`, `ENV_`, `SEQ_`)
   - Group related constants for better code completion
4. Keep the actual string values simple and lowercase
5. Add constants to p5.prototype when they need to be globally accessible
6. Document relationships between constants in comments

### Naming Convention Examples
```typescript
// Waveform-related constants
export const WAVE_SINE = 'sine';
export const WAVE_SQUARE = 'square';
export const WAVE_SAW = 'saw';
export const WAVE_TRIANGLE = 'triangle';

// Envelope-related constants
export const ENV_LINEAR = 'linear';
export const ENV_EXPONENTIAL = 'exponential';
export const ENV_TRIGGER = 'trigger';
export const ENV_GATE = 'gate';

// Sequence-related constants
export const SEQ_FORWARD = 'forward';
export const SEQ_REVERSE = 'reverse';
export const SEQ_RANDOM = 'random';
export const SEQ_PINGPONG = 'pingpong';

// Timing-related constants (if needed)
export const TIME_FRAMES = 'frames';
export const TIME_SECONDS = 'seconds';
export const TIME_MANUAL = 'manual';
```

This naming convention:
1. Makes the purpose of each constant immediately clear
2. Uses concise but recognizable prefixes
3. Maintains good grouping in code completion
4. Reduces verbosity while keeping clarity
5. Still avoids conflicts with p5.js functions
6. Makes it easy to scan and understand the code 