from setuptools import setup, find_packages

setup(
    name='battinsight',
    version='1.0',
    description='Battery Failure Visualization and Analysis Tool',
    author='BattInsight Team',
    packages=find_packages(include=['backend', 'backend.*']),
    install_requires=[
        'flask>=2.0.0',
        'flask-cors>=3.0.0',
        'sqlalchemy>=1.4.0',
        'psycopg2-binary>=2.9.0',
        'openai>=0.27.0',
        'python-dotenv>=0.19.0',
        'pandas>=1.3.0',
        'numpy>=1.20.0',
        'pytest>=6.2.0',
        'requests>=2.25.0',
    ],
    extras_require={
        'dev': [
            'pytest>=6.2.0',
            'pytest-cov>=2.12.0',
            'black>=21.5b2',
            'flake8>=3.9.0',
        ],
    },
    python_requires='>=3.8',
)