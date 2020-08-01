// マイクを用意し、ONにする
const micAudio = new Tone.UserMedia();
micAudio.open();

// testボタン押下のイベントリスナ
document.getElementById('voice_change').addEventListener('click', () => {
  // ピッチシフター（音程を変更するエフェクタ）を用意。音の高さは5。
  const shifter = new Tone.PitchShift(5);
  // マスターオーディオ（スピーカー）に接続された、リバーブ（残響効果エフェクタ）を用意。
  const reverb = new Tone.Freeverb().toMaster();
  // マイク音声をピッチシフターに接続
  micAudio.connect(shifter);
  // ピッチシフターをリバーブに接続
  shifter.connect(reverb);
});