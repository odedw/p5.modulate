---
date: '2025-02-17T21:36:46-06:00'
draft: true
title: 'Docs'
---

# p5.modulate Documentation

Welcome to the p5.modulate documentation. This library provides powerful tools for creating dynamic modulations in your p5.js sketches.

## Contents

1. [Getting Started](getting-started) - Installation and basic setup
2. Core Components:
   - [Time Functions](time-function) - Control timing and easing
   - [LFO](lfo) - Create cyclic modulations
   - [Envelope](envelope) - Shape values over time
   - [Sequencer](sequencer) - Create complex patterns

# Welcome to p5.modulate

p5.modulate is a powerful modulation library for p5.js that enables creative coding with dynamic, time-based modulations. This library provides a suite of tools for creating complex animations, sound modulations, and interactive experiences.

## Getting Started

To get started with p5.modulate, you'll need:

1. A basic understanding of p5.js
2. p5.modulate installed in your project
3. Some creativity and curiosity!

## Core Concepts

p5.modulate is built around several core concepts:

- **Envelopes**: Shape values over time
- **LFOs**: Create cyclic modulations
- **Time Functions**: Control timing and easing
- **Sequencers**: Create complex patterns

## Installation

```javascript
npm install p5.modulate
```

## Quick Example

```javascript
import { createEnvelope } from 'p5.modulate';

// Create a simple envelope
const fadeIn = createEnvelope({
  attack: 1.0,
  decay: 0.5,
  sustain: 0.8,
  release: 2.0
});
```

Explore the documentation to learn more about what p5.modulate can do!
