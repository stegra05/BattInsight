# BattInsight Architecture Documentation

This directory contains architectural documentation for the BattInsight project, including diagrams and improved project structure recommendations.

## Contents

1. [Architecture Diagram](architecture_diagram.md) - Overview of application components and their relationships
2. [Data Flow Diagram](data_flow_diagram.md) - Visualization of how data moves through the application
3. [Deployment Diagram](deployment_diagram.md) - Docker container structure and relationships
4. [Class Diagram](class_diagram.md) - Key classes and their relationships

## How to View Diagrams

These diagrams are written in Mermaid JS syntax. You can view them in several ways:

1. **GitHub**: If you're viewing this on GitHub, the diagrams will render automatically.
2. **Mermaid Live Editor**: Copy the diagram code and paste it into [Mermaid Live Editor](https://mermaid.live/).
3. **VS Code**: Install the "Markdown Preview Mermaid Support" extension to view diagrams in VS Code.
4. **Browser Extensions**: Various browser extensions can render Mermaid diagrams in Markdown files.

## Architecture Overview

BattInsight follows a modern fullstack architecture with clear separation of concerns:

- **Frontend**: React application with Chakra UI components
- **Backend**: Flask application with PostgreSQL database
- **Containerization**: Docker with multi-container orchestration

The application is designed to be modular, maintainable, and scalable, with a focus on performance and security.
