"""
Zweck: Enthält Funktionen zur Datenaufbereitung und Berechnung von KPIs.
Funktionen:
	•	Normalisiert CSV-Daten für die Datenbank.
	•	Berechnet Metriken wie failure_rate_per_million_units.
Abhängigkeiten:
	•	pandas zur Datenverarbeitung.
	•	models.py für den Datenzugriff.
"""

import pandas as pd


def normalize_csv_data(file_path: str) -> pd.DataFrame:
    """
    Liest eine CSV-Datei ein, normalisiert die Spaltennamen und gibt ein DataFrame zurück.
    """
    df = pd.read_csv(file_path)
    # Normalisierung der Spaltennamen: Entferne führende und nachfolgende Leerzeichen, setze in Kleinbuchstaben und ersetze Leerzeichen durch Unterstriche
    df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
    return df


def calculate_failure_rate_per_million(df: pd.DataFrame) -> pd.DataFrame:
    """
    Berechnet die Kennzahl 'failure_rate_per_million_units'.
    Es wird angenommen, dass das DataFrame die Spalten 'failures' und 'units' enthält.
    Die Kennzahl wird berechnet als: (failures / units) * 1e6.
    """
    if 'failures' not in df.columns or 'units' not in df.columns:
        raise ValueError('Das DataFrame muss die Spalten "failures" und "units" enthalten.')
    df['failure_rate_per_million_units'] = (df['failures'] / df['units']) * 1e6
    return df

def calculate_average_failure_rate(df: pd.DataFrame) -> float:
    """
    Berechnet die durchschnittliche Fehlerquote.
    """
    if 'failure_rate_per_million_units' not in df.columns:
        raise ValueError('Das DataFrame muss die Spalte "failure_rate_per_million_units" enthalten.')
    return df['failure_rate_per_million_units'].mean()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python data_processor.py <path_to_csv>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    try:
        df = normalize_csv_data(file_path)
        df = calculate_failure_rate_per_million(df)
        avg_failure_rate = calculate_average_failure_rate(df)
        print("Berechnete Kennzahlen:")
        print(df[['failures', 'units', 'failure_rate_per_million_units']])
        print(f"Durchschnittliche Fehlerquote: {avg_failure_rate}")
    except Exception as e:
        print(f"Fehler bei der Datenverarbeitung: {e}")