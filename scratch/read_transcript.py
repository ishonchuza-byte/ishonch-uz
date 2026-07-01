import json

with open(r'C:\Users\Xp11\.gemini\antigravity\brain\ab557d06-b0e5-4266-ba43-5614649a17ff\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    out_lines = []
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                out_lines.append(f"[{data.get('created_at')}]:\n{data.get('content')}\n" + "-"*50 + "\n")
        except Exception as e:
            pass

with open('scratch/decoded_requests.txt', 'w', encoding='utf-8') as out_f:
    out_f.writelines(out_lines)
