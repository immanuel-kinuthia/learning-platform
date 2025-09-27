import logging
from logging.config import fileConfig
from flask import current_app
from alembic import context

config = context.config

fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

