#!/usr/bin/env python3
"""
Chinese TTS using gTTS (Google Text-to-Speech)
Generates MP3 audio from Chinese text.
"""
import sys
from gtts import gTTS

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 tts.py '中文文本' [output_path]")
        print("Example: python3 tts.py '你好，世界' /tmp/output.mp3")
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "/tmp/chinese_tts_output.mp3"
    
    try:
        tts = gTTS(text=text, lang='zh-cn')
        tts.save(output_path)
        print(output_path)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
