"""
autocaddy.py
--------------

This module implements a simple proof‑of‑concept for automatically selecting
the most appropriate AI extension or service for a given development task. It
is designed to complement the multi‑configurator by choosing the correct
assistant based on keywords in a task description. The choices below are
examples drawn from popular AI extensions available for Visual Studio Code;
they can be expanded or refined to match your organisation’s actual tools.

Usage
-----

Run this script with Python 3. When prompted, enter a sentence or two
describing your current task (for example, "I need to execute commands on a
remote Linux server" or "I want to control VS Code from my phone"). The
script will analyse the text and suggest which AI extension best fits the
scenario.

This example is intentionally lightweight. In a real‑world application you
might integrate natural‑language processing, machine learning, or a more
comprehensive rule engine to determine the best connector. Likewise, you
could hook this logic into your multi‑configurator to automatically attach
the appropriate helper whenever a new configuration is generated.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Callable, Optional


@dataclass
class Connector:
    """Represents an AI connector with a human‑readable name and a predicate.

    The predicate function should return True if the connector is suitable for
    the given task description.
    """

    name: str
    predicate: Callable[[str], bool]


def _contains_any(text: str, keywords: list[str]) -> bool:
    """Return True if any of the keywords appear in the text (case‑insensitive)."""
    lower = text.lower()
    return any(word in lower for word in keywords)


def build_connectors() -> Dict[str, Connector]:
    """Define the available connectors and their selection logic."""
    return {
        "AirCodum": Connector(
            name="AirCodum (smartphone remote control)",
            predicate=lambda t: _contains_any(t, ["phone", "smartphone", "file transfer", "vnc", "screen"]),
        ),
        "Cursor Autopilot": Connector(
            name="Cursor Autopilot (remote chat control)",
            predicate=lambda t: _contains_any(t, ["telegram", "email", "feishu", "chat", "autopilot"]),
        ),
        "Linux Command MCP": Connector(
            name="Linux Command MCP (remote shell)",
            predicate=lambda t: _contains_any(t, ["linux", "server", "command", "terminal", "shell"]),
        ),
        "GPUGo": Connector(
            name="GPUGo (remote GPU environment)",
            predicate=lambda t: _contains_any(t, ["gpu", "compute", "cuda", "training", "machine learning"]),
        ),
    }


def select_connector(task_description: str, connectors: Optional[Dict[str, Connector]] = None) -> str:
    """Return the name of the first connector whose predicate matches the description.

    If no connector matches, a fallback string is returned.
    """
    if connectors is None:
        connectors = build_connectors()
    for key, connector in connectors.items():
        if connector.predicate(task_description):
            return connector.name
    return "No specific connector identified – use the default assistant."


def main() -> None:
    """Command‑line entry point for testing the connector selection."""
    connectors = build_connectors()
    print("Describe your task and I'll suggest the best AI helper.")
    try:
        while True:
            description = input("\nTask description (or press Enter to quit): ").strip()
            if not description:
                break
            suggestion = select_connector(description, connectors)
            print(f"Suggested AI connector: {suggestion}")
    except KeyboardInterrupt:
        print("\nExiting.")


if __name__ == "__main__":
    main()