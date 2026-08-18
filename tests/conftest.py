"""Options must live here: pytest only reads addoption from conftest.

The tests compare a *built site* against the *vault it was built from*, so both
have to be named. Defaults match `python -m core.build` with no arguments.
"""
import os


def pytest_addoption(parser):
    parser.addoption("--site", default="dist", help="Built site directory")
    parser.addoption(
        "--vault",
        default=os.environ.get("VAULT_PATH", str(os.path.expanduser("~/notes"))),
        help="Vault the site was built from",
    )
