# Factory Method Argument Patterns

This document analyzes different patterns for factory method arguments in p5.modulate, considering p5.js conventions, developer ergonomics, and TypeScript integration.

## Patterns

### 1. Flat Arguments List
```typescript
createLfo(WAVE_SINE, 0, 1);
createTimeFunction(TIME_FRAMES, 60);
```

#### Pros
- Simple and concise for few arguments
- Clear order of arguments
- Good for required parameters
- Familiar to p5.js users (e.g., `circle(x, y, d)`)
- Works well with TypeScript parameter types

#### Cons
- Not flexible for optional parameters
- Hard to remember argument order with many parameters
- No parameter names at call site
- Requires overloads for different argument combinations
- Gets unwieldy with more than 3-4 arguments

### 2. Options Object
```typescript
createLfo({
  waveform: WAVE_SINE,
  min: 0,
  max: 1,
  frequency: TimeFunction.frames(60)
});

createTimeFunction({
  type: TIME_FRAMES,
  value: 60,
  loop: true,
  easing: EASE_LINEAR
});
```

#### Pros
- Self-documenting parameter names
- Flexible for optional parameters
- Order doesn't matter
- Easy to add new parameters
- Great TypeScript integration with interfaces
- Good for complex objects with many properties

#### Cons
- More verbose for simple cases
- Requires remembering property names
- May feel heavy for very simple objects
- Extra typing with curly braces and colons

### 3. Mixed Approach (Main Args + Options Object)
```typescript
createLfo(WAVE_SINE, {
  min: 0,
  max: 1,
  frequency: TimeFunction.frames(60)
});

createTimeFunction(TIME_FRAMES, 60, {
  loop: true,
  easing: EASE_LINEAR
});
```

#### Pros
- Highlights primary parameters
- Flexible for optional parameters
- Good balance of conciseness and clarity
- Works well for required + optional parameters
- Maintains good TypeScript support

#### Cons
- Two different styles in one call
- Can be confusing which parameters go where
- Might be inconsistent across different functions
- More complex TypeScript types

### 4. Builder Pattern
```typescript
createLfo()
  .withWaveform(WAVE_SINE)
  .withRange(0, 1)
  .withFrequency(TimeFunction.frames(60))
  .build();
```

#### Pros
- Very explicit and readable
- Great for complex objects
- Flexible order
- Self-documenting
- Good for step-by-step configuration

#### Cons
- Very verbose
- Overkill for simple cases
- Not common in p5.js
- Requires more boilerplate code
- Less performant

## p5.js Conventions

p5.js uses different patterns depending on the context:

1. **Simple Drawing Functions**: Flat arguments
   ```javascript
   circle(x, y, d);
   rect(x, y, w, h);
   ```

2. **Complex Objects**: Options object
   ```javascript
   createButton('label', {
     position: { x: 0, y: 0 },
     style: { color: 'red' }
   });
   ```

3. **Mixed Pattern**: Some functions use both
   ```javascript
   // Main args + optional args
   loadShader(vertSrc, fragSrc, { attributes: {...} });
   ```

## Recommendation

For p5.modulate, we recommend using **Pattern 2: Options Object** for most factory functions, with these guidelines:

1. **Use Options Object When**:
   - Function has more than 2 parameters
   - Any parameters are optional
   - Parameters have logical grouping
   - Complex object creation

   ```typescript
   createLfo({
     waveform: WAVE_SINE,
     frequency: TimeFunction.frames(60),
     min: 0,
     max: 1
   });
   ```

2. **Use Flat Arguments When**:
   - Function has 1-2 required parameters
   - No optional parameters
   - Parameters have clear, obvious order

   ```typescript
   createVector(x, y);
   ```

### Implementation Example
```typescript
// Factory function with options object
export function createLfo(options: {
  waveform: WaveformType;
  frequency?: TimeFunction;
  min?: number;
  max?: number;
}): Lfo {
  const {
    waveform,
    frequency = TimeFunction.frames(60),
    min = 0,
    max = 1
  } = options;
  
  return new Lfo(waveform, frequency, min, max);
}

// Usage
const lfo = createLfo({
  waveform: WAVE_SINE,
  max: 2 // other params use defaults
});
```

### Benefits of This Approach

1. **Consistency**: One primary pattern for most factory functions
2. **Flexibility**: Easy to add new parameters without breaking changes
3. **Self-documenting**: Clear parameter names at call site
4. **TypeScript-friendly**: Great type inference and interface support
5. **Beginner-friendly**: No need to remember parameter order
6. **IDE-friendly**: Good autocompletion support

### Exceptions

Consider using flat arguments for very simple factories that:
1. Have 1-2 parameters
2. Are used very frequently
3. Have an obvious parameter order
4. Don't need optional parameters

## Future Considerations

1. **Documentation**
   - Document parameter defaults clearly
   - Provide examples for common use cases
   - Show both simple and complex configurations

2. **TypeScript Support**
   - Use strict types for all parameters
   - Provide good type inference
   - Consider using branded types for constants

3. **API Evolution**
   - Plan for future parameter additions
   - Maintain backward compatibility
   - Consider deprecation strategies 