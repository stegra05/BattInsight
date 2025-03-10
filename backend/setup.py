from setuptools import setup, find_packages

setup(
    name="battinsight",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "flask",
        "flask-cors",
        "sqlalchemy",
        "psycopg2-binary",
        "python-dotenv",
        "openai",
        "pandas",
    ],
) 