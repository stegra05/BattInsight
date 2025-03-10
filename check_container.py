import subprocess
import sys

def run_command(command):
    print(f"Running command: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(e.stderr)
        return None

print("Checking Docker containers...")
run_command("docker ps")

print("\nChecking if port 5000 is open...")
run_command("docker exec docker-backend-1 netstat -tuln | grep 5000")

print("\nChecking logs of backend container...")
run_command("docker logs docker-backend-1 | tail -n 20") 