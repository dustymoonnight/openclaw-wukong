---
name: chinese-tts
description: 中文语音合成工具。当用户要求用语音回复、发送语音消息、或需要将文字转换为中文语音时使用。使用 gTTS (Google Text-to-Speech) 生成标准普通话语音。
---

# Chinese TTS

将中文文本转换为语音（MP3 格式），支持通过 Telegram 等渠道发送语音消息。

## 使用方法

### 1. 生成语音文件

```python
from gtts import gTTS

tts = gTTS(text='中文文本', lang='zh-cn')
tts.save('/tmp/output.mp3')
```

或使用提供的脚本：

```bash
python3 skills/chinese-tts/scripts/tts.py '中文文本' /tmp/output.mp3
```

### 2. 发送语音消息

生成后使用 `message` 工具发送：

```json
{
  "action": "send",
  "asVoice": true,
  "media": "/tmp/output.mp3",
  "target": "telegram:8304964064"
}
```

## 注意事项

- 语言代码：`zh-cn`（简体中文）
- 输出格式：MP3
- 需要预先安装：`pip install gtts`
- 语调为标准普通话，暂不支持自定义音色

## 示例流程

用户说："用语音回复我今天的天气"

1. 获取天气信息
2. 生成语音：`python3 skills/chinese-tts/scripts/tts.py '杭州今天有霾，15度' /tmp/weather.mp3`
3. 发送：`message send asVoice=true media=/tmp/weather.mp3`
