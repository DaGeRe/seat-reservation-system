#!/bin/bash

# prettify_xml.sh: XML-Prettifier ohne xmllint

# Überprüfen, ob eine Eingabedatei angegeben wurde
if [ $# -eq 0 ]; then
  echo "Verwendung: $0 <input-xml-file> [output-xml-file]"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# Prüfen, ob die Eingabedatei existiert
if [ ! -f "$INPUT_FILE" ]; then
  echo "Fehler: Datei '$INPUT_FILE' existiert nicht."
  exit 1
fi

# Python verwenden, um die XML-Datei zu formatieren
if [ -z "$OUTPUT_FILE" ]; then
  # Wenn keine Ausgabedatei angegeben ist, Ausgabe auf stdout
  python3 -c "import sys, xml.dom.minidom as md; print(md.parse(sys.argv[1]).toprettyxml())" "$INPUT_FILE"
else
  # Wenn eine Ausgabedatei angegeben ist, speichern
  python3 -c "import sys, xml.dom.minidom as md; open(sys.argv[2], 'w').write(md.parse(sys.argv[1]).toprettyxml())" "$INPUT_FILE" "$OUTPUT_FILE"
  echo "Formatiertes XML wurde in '$OUTPUT_FILE' gespeichert."
fi
