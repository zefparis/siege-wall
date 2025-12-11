"""
Structured logging configuration for HCS-U7 Siege Wall
"""
import logging
import sys
from datetime import datetime
from typing import Any
import json


class StructuredFormatter(logging.Formatter):
    """
    Custom formatter that outputs structured JSON logs for production
    and human-readable logs for development.
    """
    
    def __init__(self, json_format: bool = False):
        super().__init__()
        self.json_format = json_format
    
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields if present
        if hasattr(record, "extra") and record.extra:
            log_data["extra"] = record.extra
        
        if self.json_format:
            return json.dumps(log_data)
        else:
            # Human-readable format for development
            extra_str = ""
            if hasattr(record, "extra") and record.extra:
                extra_str = f" | {record.extra}"
            
            level_colors = {
                "DEBUG": "\033[36m",    # Cyan
                "INFO": "\033[32m",     # Green
                "WARNING": "\033[33m",  # Yellow
                "ERROR": "\033[31m",    # Red
                "CRITICAL": "\033[35m", # Magenta
            }
            reset = "\033[0m"
            color = level_colors.get(record.levelname, "")
            
            return (
                f"{log_data['timestamp']} | "
                f"{color}{record.levelname:8}{reset} | "
                f"{record.name}:{record.funcName}:{record.lineno} | "
                f"{record.getMessage()}{extra_str}"
            )


def setup_logging(debug: bool = False, json_format: bool = False) -> None:
    """
    Setup structured logging for the application.
    
    Args:
        debug: Enable debug level logging
        json_format: Use JSON format (recommended for production)
    """
    level = logging.DEBUG if debug else logging.INFO
    
    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    
    # Remove existing handlers
    root_logger.handlers.clear()
    
    # Console handler with structured formatter
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(StructuredFormatter(json_format=json_format))
    
    root_logger.addHandler(console_handler)
    
    # Silence noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("websockets").setLevel(logging.WARNING)
    
    # Log startup
    logger = logging.getLogger(__name__)
    logger.info(
        "Logging configured",
        extra={"level": logging.getLevelName(level), "json_format": json_format}
    )


class LoggerAdapter(logging.LoggerAdapter):
    """
    Custom logger adapter that supports extra fields.
    """
    
    def process(self, msg, kwargs):
        # Merge extra from adapter with extra from log call
        extra = self.extra.copy() if self.extra else {}
        if "extra" in kwargs:
            extra.update(kwargs["extra"])
        kwargs["extra"] = {"extra": extra}
        return msg, kwargs


def get_logger(name: str, **extra) -> LoggerAdapter:
    """
    Get a logger with optional extra context.
    
    Args:
        name: Logger name (usually __name__)
        **extra: Additional context to include in all log messages
    
    Returns:
        LoggerAdapter with extra context
    """
    logger = logging.getLogger(name)
    return LoggerAdapter(logger, extra)
