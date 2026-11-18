from dataclasses import dataclass
from enum import Enum


class RobotStatus(Enum):
    RUNNING = "running"
    STOPPED = "stopped"
    ERROR = "error"

class ConnectionStatus(Enum):
    ONLINE = "online"
    OFFLINE = "offline"


@dataclass
class Robot:
    robot_id: str
    name: str
    robot_type: str
    status: RobotStatus
    cpu_usage: float
    memory_usage: float
    connection_status: ConnectionStatus = ConnectionStatus.ONLINE


robot1 = Robot(
    robot_id="robot-001",
    name="Happy Mini",
    robot_type="mobile",
    status=RobotStatus.RUNNING,
    cpu_usage=35.2,
    memory_usage=62.0
)

connection_status: str = "online"