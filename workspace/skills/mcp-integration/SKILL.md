---
name: mcp-integration
description: MCP集成层系统。包含multi-transport connectivity、auth lifecycle handling、tool和resource discovery、output persistence、session-expiry recovery和elicitation support。用于构建或审计MCP clients、connector planes或external tool integration systems。
---

# MCP Integration Plane

## Overview

Design, review, or debug MCP integration layers with multi-transport connectivity, auth lifecycle handling, tool and resource discovery, output persistence, session-expiry recovery, and elicitation support.

## Source Anchors

- MCP client implementation
- Transport layer abstraction

## Workflow

1. Establish multi-transport connectivity
2. Handle auth lifecycle
3. Discover tools and resources
4. Persist outputs
5. Recover from session expiry
6. Support elicitation

## Design Rules

- Transport abstraction for flexibility
- Auth lifecycle management
- Tool/resource discovery protocol
- Output persistence strategy
- Graceful session recovery

## Output

- Integration architecture diagram
- Auth flow documentation
- Tool discovery schema
