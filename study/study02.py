from study01 import Robot, RobotStatus, ConnectionStatus

robot1 = Robot(
    robot_id="robot-001",
    name="Happy Mini",
    robot_type="mobile",
    status=RobotStatus.RUNNING,
    cpu_usage=35.2,
    memory_usage=62.0,
    connection_status=ConnectionStatus.ONLINE
)

robot2 = Robot(
    robot_id="robot-002",
    name="Robot B",
    robot_type="mobile",
    status=RobotStatus.STOPPED,
    cpu_usage=0.0,
    memory_usage=0.0,
    connection_status=ConnectionStatus.OFFLINE
)

robot3 = Robot(
    robot_id="robot-003",
    name="Robot C",
    robot_type="arm",
    status=RobotStatus.ERROR,
    cpu_usage=72.5,
    memory_usage=80.0,
    connection_status=ConnectionStatus.ONLINE
)

robot2.status = RobotStatus.RUNNING
robot2.connection_status = ConnectionStatus.ONLINE

robots = [robot1, robot2, robot3]

print("=== Robot Management System ===")

for robot in robots:
    print(f"ID: {robot.robot_id}")
    print(f"Name: {robot.name}")
    print(f"Status: {robot.status.value}")
    print(f"CPU: {robot.cpu_usage}%")
    print(f"Memory: {robot.memory_usage}%")
    print(f"Connection: {robot.connection_status.value}")
    print("--------------------")

running_count = 0
connection_count = 0

for robot in robots:
    if robot.status == RobotStatus.RUNNING:
        running_count += 1

    if robot.connection_status == ConnectionStatus.ONLINE:
        connection_count += 1

print(f"Running robots: {running_count}")
print(f"Online robots: {connection_count}")