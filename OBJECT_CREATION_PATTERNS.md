# Object Creation Patterns for p5.modulate

This document analyzes different patterns for creating objects (LFO, Envelope, etc.) in p5.modulate.

## 1. Constructor Approach
```typescript
const lfo = new Lfo({ frequency: 1, waveform: 'sine' });
```

### Pros
- Standard JavaScript/TypeScript pattern
- Clear and explicit instantiation
- Excellent TypeScript support with clear typing
- Works well with IDE autocompletion
- Direct access to instance methods and properties
- Clear prototype chain

### Cons
- Doesn't follow p5.js conventions (p5.js typically uses factory functions)
- Requires users to understand the `new` keyword and constructor pattern
- Less integrated with p5's instance mode
- Might be confusing for beginners used to p5.js's functional style
- Exposes implementation details

## 2. Factory Function
```typescript
const lfo = createLfo({ frequency: 1, waveform: 'sine' });
```

### Pros
- Follows p5.js conventions (e.g., `createCanvas()`, `createVector()`)
- Familiar to p5.js users
- Can be easily added to p5.prototype for global access
- More beginner-friendly
- Hides implementation details
- Can implement different creation strategies without changing the API
- Works well in both global and instance mode
- Can include validation and default values

### Cons
- Less explicit about the type being created
- Slightly more verbose in TypeScript when defining return types
- Additional layer of abstraction
- May need extra work to maintain method chaining

## 3. Namespace with Create Method
```typescript
const lfo = Lfo.create({ frequency: 1, waveform: 'sine' });
```

### Pros
- Provides a clear namespace for related functionality
- Good for organizing multiple factory methods
- Can include other static utilities in the same namespace
- More explicit about what's being created than simple factory function
- Good for grouping related static methods
- Clear separation of concerns

### Cons
- Less common in p5.js ecosystem
- Adds an extra level of nesting
- Might be confusing for beginners
- Deviates from typical p5.js patterns
- More verbose than other options

## 4. Builder Pattern
```typescript
const lfo = new LfoBuilder()
  .setFrequency(1)
  .setWaveform('sine')
  .build();
```

### Pros
- Very explicit and readable
- Great for objects with many optional parameters
- Provides step-by-step configuration
- Good for complex object creation
- Makes parameter setting very clear
- Excellent for method chaining

### Cons
- Much more verbose than other options
- Overkill for simple objects
- Not common in p5.js ecosystem
- Requires more boilerplate code
- May be confusing for beginners

## 5. Module Function
```typescript
const lfo = lfo({ frequency: 1, waveform: 'sine' });
```

### Pros
- Very simple and concise
- Functional programming style
- No `new` keyword or explicit creation methods
- Clean and minimal
- Easy to understand

### Cons
- May be confused with regular functions
- Less explicit about creating an instance
- Doesn't follow p5.js naming conventions
- May be harder to distinguish from utility functions
- Less clear about the returned type

## 6. p5.js Extension Method
```typescript
const lfo = p.lfo({ frequency: 1, waveform: 'sine' });
```

### Pros
- Fully integrated with p5 instance
- Very concise
- Consistent with some p5.js methods (like `random()`, `noise()`)
- Direct access to p5 context
- Works well with instance mode

### Cons
- Deviates from p5.js creation convention (`create` prefix)
- May be confused with utility functions
- Less explicit about object creation
- Might conflict with future p5.js methods
- Less clear about instantiation

## Recommendation

Based on p5.js conventions and the library's goals, the **Factory Function** pattern (Option 2) is recommended because:

1. It follows p5.js conventions
2. It's familiar to the target audience
3. It works well in both global and instance mode
4. It's beginner-friendly
5. It provides flexibility for future implementation changes

### Example Implementation
```typescript
// Internal class
class Lfo {
  constructor(options: LfoOptions) {
    // implementation
  }
}

// Public factory function
function createLfo(options: LfoOptions): Lfo {
  return new Lfo(options);
}

// Add to p5 prototype
p5.prototype.createLfo = createLfo;
```

### Usage
```typescript
// Global mode
let lfo = createLfo({ frequency: 1, waveform: 'sine' });

// Instance mode
function sketch(p) {
  let lfo = p.createLfo({ frequency: 1, waveform: 'sine' });
}
``` 