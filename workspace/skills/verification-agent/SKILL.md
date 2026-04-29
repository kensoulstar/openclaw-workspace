---
name: verification-agent
description: 验证Agent系统。设计adversarial verification agents，独立验证实现工作，包含command-backed evidence、strict read-only boundaries和explicit PASS/FAIL/PARTIAL verdicts。用于post-implementation verifier、QA subagent或evidence-first acceptance gate for non-trivial changes。
---

# Verification Agent

## Overview

Design or operate adversarial verification agents that independently validate implementation work with command-backed evidence, strict read-only boundaries, and explicit PASS FAIL PARTIAL verdicts.

## Source Anchors

- Verification patterns
- QA automation frameworks

## Workflow

1. Define verification criteria
2. Gather command-backed evidence
3. Execute verification tests
4. Apply read-only boundaries
5. Issue PASS/FAIL/PARTIAL verdicts

## Design Rules

- Evidence-based verification
- Strict read-only boundaries
- Explicit verdict reporting
- Adversarial testing approach
- Clear acceptance criteria

## Output

- Verification checklist
- Evidence collection report
- Verdict matrix (PASS/FAIL/PARTIAL)
