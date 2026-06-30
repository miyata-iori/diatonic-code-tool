//TODO
//UIを見やすくする
//コードを選択しそれを羅列していく場所を作る

//① HTML要素
const modeBtn = document.querySelector('#mode-btn');
const keySelect = document.querySelector('#keySelect');
const textScale = document.querySelector('#scale');
const buttonSpace = document.querySelector('#dCode');
const recommendSpace = document.querySelector('#recommendBubble');


//②変数、定数
let mode = 'major';

//③配列型の変数、定数
const majorNotes = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const minorNotes = ['C','C#','D','D#','E','F','F#','G','G#','A','Bb','B'];
//異名同音を変換する
const enharmonic = {
    'Db':'C#',
    'Eb':'D#',
    'Ab':'G#',
    //逆変換も必要
    'C#':'Db',
    'D#':'Eb',
    'G#':'Ab',
};
//Mとmのスケールの取り方ルール
const majorScale = [0,2,4,5,7,9,11];
const minorScale = [0,2,3,5,7,8,10];
//M、mコードのトライアドの取り方ルール
const ChordTypes = {
                    major:[0%12, 4%12, 7%12],
                    minor:[0%12, 3%12, 7%12],
                    diminished:[0%12, 3%12, 6%12],
                    };
//コードの表示名設定
const chordName = {
                    major: "",
                    minor: "m",
                    diminished: "dim",
};
//ディグリー表記に変換する                    
const degreeExchange = 
{
    major: {
        '1':'Ⅰ',
        '2':'ⅱ',
        '3':'ⅲ',
        '4':'Ⅳ',
        '5':'Ⅴ',
        '6':'ⅵ',
        '7':'ⅶ°',
    },
    minor: {
        '1':'ⅰ',
        '2':'ⅱ°',
        '3':'Ⅲ',
        '4':'ⅳ',
        '5':'ⅴ',
        '6':'Ⅵ',
        '7':'Ⅶ',
        },
}; 
//ダイアトニックコードのM/mパターン
const diatonicChordTypes = {
    major:[
        'major',
        'minor',
        'minor',
        'major',
        'major',
        'minor',
        'diminished',
    ],
    minor:[
        'minor',
        'diminished',
        'major',
        'minor',
        'minor',
        'major',
        'major',
    ]
};
//ダイアトニックコードの機能和声的な接続理由
const connectionReason ={
    type: 'resolution', // 解決　明るい青？
    type: 'development',// 展開　赤
    type: 'deceptive',   // 予想を外す　紫
    type: 'cycle',       // 循環進行　暗い青
    type: 'soft',        // 穏やかな接続　緑
}
//ダイアトニックコードの接続
const connectionDcode = {
    major: {
        1: [
            { recommend: 2, reason: "サブドミナントへの移行", type: "development"},
            { recommend: 3, reason: "トニックに似た安定を保ちながらの移行", type: "soft"},
            { recommend: 4, reason: "サブドミナントへの移行", type: "development"},
            { recommend: 5, reason: "ドミナントへの移行、緊張を作る", type: "development"},
            { recommend: 6, reason: "トニック代理への移行", type: "soft"},
            { recommend: 7, reason: "強い不安定感を作る", type: "deceptive"},
        ],
        2: [
            { recommend: 1, reason: "トニックへ戻り、いったん安定する", type: "resolution"},
            { recommend: 3, reason: "少し不自然ながらふわっと響きを変える", type: "deceptive"},
            { recommend: 4, reason: "同じサブドミナント系へ進み、展開を保つ", type: "development"},
            { recommend: 5, reason: "サブドミナントからドミナントへ進む定番の流れ", type: "development"},
            { recommend: 6, reason: "トニック代理へ進み、意外かつ落ち着いた響きに移る", type: "soft"},
            { recommend: 7, reason: "不安定なコードへ進み、解決前の緊張を強める", type: "development"},
        ],
        3: [
            { recommend: 1, reason: "半分仲間のトニックへ戻り、安定した響きに解決する", type: "resolution"},
            { recommend: 2, reason: "サブドミナントへ向かい、次の展開を作る", type: "development"},
            { recommend: 4, reason: "隣のコードへ進み、なめらかに明るく展開する", type: "development"},
            { recommend: 5, reason: "ドミナントへ進み、少し意外ながら緊張を作る", type: "deceptive"},
            { recommend: 6, reason: "自然にトニック代理へ移る", type: "resolution"},
            { recommend: 7, reason: "不安定な響きへ進み、意外性と緊張を作る", type: "deceptive"},
        ],
        4: [
            { recommend: 1, reason: "サブドミナントからトニックへ戻る柔らかく優しい解決", type: "resolution"},
            { recommend: 2, reason: "同じサブドミナント系へ寄り道して自然につなげる", type: "soft"},
            { recommend: 3, reason: "トニックに近い響きへ移り、穏やかに落ち着く", type: "soft"},
            { recommend: 5, reason: "サブドミナントからドミナントへ進む基本的な流れ", type: "development"},
            { recommend: 6, reason: "トニック代理へ進み、少し切ない安定感を作る", type: "resolution"},
            { recommend: 7, reason: "不安定なコードへ進み、次の解決を強く期待させる", type: "deceptive"},
        ],
        5: [
            { recommend: 1, reason: "ドミナントからトニックへ解決する一番強い終止", type: "resolution"},
            { recommend: 2, reason: "サブドミナントへ戻り、進行を引き延ばす", type: "development"},
            { recommend: 3, reason: "トニックに近いが、解決感を少しぼかす", type: "deceptive"},
            { recommend: 4, reason: "サブドミナントへ戻り、展開を作り直す", type: "development"},
            { recommend: 6, reason: "代理トニックへの着地による解決、偽終止", type: "resolution"},
            { recommend: 7, reason: "不安定な導音和音へ進み、緊張をさらに保つ", type: "deceptive"},
        ],
        6: [
            { recommend: 1, reason: "トニック代理からトニックへ戻り、安定を強める", type: "soft"},
            { recommend: 2, reason: "循環進行につながりやすいサブドミナントへの移行", type: "development"},
            { recommend: 3, reason: "近い響きへ戻り、穏やかに色合いを変える", type: "deceptive"},
            { recommend: 4, reason: "サブドミナントへ進み、展開を作る", type: "development"},
            { recommend: 5, reason: "ドミナントへ進み、解決への緊張を作る", type: "development"},
            { recommend: 7, reason: "不安定なコードへ進み、意外性のある緊張を作る", type: "deceptive"},
        ],
        7: [
            { recommend: 1, reason: "導音を含む不安定なコードがトニックへ解決する", type: "resolution"},
            { recommend: 2, reason: "解決せずにサブドミナントへ進む", type: "deceptive"},
            { recommend: 3, reason: "トニックに近い響きへ進み、少し弱めに解決する", type: "resolution"},
            { recommend: 4, reason: "解決せずにサブドミナントへ進む", type: "deceptive"},
            { recommend: 5, reason: "ドミナントへ進み、不安定さをさらに保つ", type: "deceptive"},
            { recommend: 6, reason: "トニック代理へ進み、予想を外した落ち着き方をする", type: "resolution"},
        ],
    }, 
    minor: {
        1: [
            { recommend: 2, reason: "不安定なii°へ進み、次の解決を強く期待させる", type: "deceptive"},
            { recommend: 3, reason: "平行長調のトニックへ移り、明るさを足す", type: "soft"},
            { recommend: 4, reason: "サブドミナントへ進み、短調らしい展開を作る", type: "development"},
            { recommend: 5, reason: "短調のドミナントへ進み、穏やかな緊張を作る", type: "development"},
            { recommend: 6, reason: "サブドミナントへ進み、雰囲気を切なくする", type: "development"},
            { recommend: 7, reason: "ベースラインが滑らかに下がる、繋ぎの役割", type: "development"},
        ],
        2: [
            { recommend: 1, reason: "不安定なii°からトニックへ戻り、強く安定する", type: "resolution"},
            { recommend: 3, reason: "平行長調へ進み、不安定さを明るくほどく", type: "resolution"},
            { recommend: 4, reason: "サブドミナントへ進み、短調らしい展開を続ける", type: "development"},
            { recommend: 5, reason: "短調の穏やかなドミナントへ進み、次の安定を期待させる", type: "development"},
            { recommend: 6, reason: "VIへ進み、暗さの中にやわらかい安定感を作る", type: "soft"},
            { recommend: 7, reason: "VIIへ進み、ベースラインを滑らかに動かす", type: "development"},
        ],
        3: [
            { recommend: 1, reason: "平行長調から短調のトニックへ戻り、陰りを作る", type: "resolution"},
            { recommend: 2, reason: "ii°へ進み、不安定な響きで緊張を作る", type: "deceptive"},
            { recommend: 4, reason: "隣のサブドミナントへ進み、なめらかに展開する", type: "soft"},
            { recommend: 5, reason: "短調の穏やかなドミナントへ進み、穏やかな緊張を作る", type: "development"},
            { recommend: 6, reason: "VIへ進み、平行長調の明るさを残しながら色を変える", type: "soft"},
            { recommend: 7, reason: "VIIへ進み、明るさを保ったまま次へつなぐ", type: "development"},
        ],
        4: [
            { recommend: 1, reason: "サブドミナントからトニックへ戻る短調らしい解決", type: "resolution"},
            { recommend: 2, reason: "ii°へ進み、不安定さを加えて展開する", type: "deceptive"},
            { recommend: 3, reason: "平行長調へ進み、少し明るく展開する", type: "soft"},
            { recommend: 5, reason: "短調の穏やかなドミナントへ進み、自然に緊張を作る", type: "development"},
            { recommend: 6, reason: "VIへ進み、柔らかい短調の色合いを作る", type: "soft"},
            { recommend: 7, reason: "VIIへ進み、次の展開へ滑らかにつなぐ", type: "development"},
        ],
        5: [
            { recommend: 1, reason: "短調のドミナントからトニックへ戻り、中心へ解決する", type: "resolution"},
            { recommend: 2, reason: "ii°へ進み、緊張を保ったまま展開する", type: "deceptive"},
            { recommend: 3, reason: "平行長調へ進み、解決感を明るくぼかす", type: "soft"},
            { recommend: 4, reason: "サブドミナントへ戻り、展開を作り直す", type: "development"},
            { recommend: 6, reason: "VIへ進み、予想を外した落ち着き方をする", type: "deceptive"},
            { recommend: 7, reason: "VIIへ進み、さらに先へ進む流れを作る", type: "development"},
        ],
        6: [
            { recommend: 1, reason: "VIからトニックへ戻り、短調の安定へ落ち着く", type: "resolution"},
            { recommend: 2, reason: "ii°へ進み、不安定さを作って展開する", type: "deceptive"},
            { recommend: 3, reason: "平行長調へ進み、明るい安定感を作る", type: "soft"},
            { recommend: 4, reason: "サブドミナントへ進み、短調らしい展開を続ける", type: "development"},
            { recommend: 5, reason: "短調の穏やかなドミナントへ進み、トニックへの戻りを期待させる", type: "development"},
            { recommend: 7, reason: "VIIへ進み、ベースラインを滑らかに動かす", type: "development"},
        ],
        7: [
            { recommend: 1, reason: "サブトニックからトニックへ戻り、素朴に解決する", type: "resolution"},
            { recommend: 2, reason: "ii°へ進み、予想外の不安定さを作る", type: "deceptive"},
            { recommend: 3, reason: "VIIからIIIへ進み、平行長調へ明るく解決する", type: "resolution"},
            { recommend: 4, reason: "サブドミナントへ進み、展開を続ける", type: "development"},
            { recommend: 5, reason: "短調の穏やかなドミナントへ進み、解決前の緊張を作る", type: "development"},
            { recommend: 6, reason: "VIへ進み、落ち着いた色合いに移る", type: "soft"},
        ],
    }
}
//④関数
const noteUpDate = () => {

    //現在の選択保存、カラならCにする（初期設定）
    let currentValue = keySelect.value || 'C';
    
    //挿入前に全部消す
    keySelect.innerHTML = '';

    const nowNotes = 
    mode === 'major'
    ? majorNotes
    : minorNotes;
    nowNotes.forEach((nowNote) =>{
        const optionName = `<option value="${nowNote}">${nowNote}</option>`;
        keySelect.insertAdjacentHTML('beforeend', optionName );
    }
);
    //異名同音なら変換、違う(enharmonicにてundefined)ならそのまま
    currentValue =
    enharmonic[currentValue]
    || currentValue;
    //nowNotesにcurrentValueが含まれていないならCにする
    if(!nowNotes.includes(currentValue)){
        currentValue = 'C';
    }
    //前の選択へ戻す
    keySelect.value = currentValue;
    //現在の選択キーを他の関数でも使えるように返しておく
    return currentValue;

};

//キー、もしくはM、mが変更されたときに適切なスケールをルールに従い生成する
const createScale = ()=>{   
//メジャーorマイナーによって使うスケールを変える
const scalePatternNotes = 
    mode === 'major'
    ? majorNotes
    : minorNotes;
const scalePatternScale = 
    mode === 'major'
    ? majorScale
    : minorScale;
//キーをそのスケールの根音として設定
const rootOfScale = keySelect.value;
//その根音がNotesの中で何番目にあるか取得
const rootIndex = scalePatternNotes.indexOf(rootOfScale);
//キーとM/nからスケールを生成
//nanatuはscalePatternScale、つまり何番目の音を拾うかの配列、やっていることは2+[0,2,3,4]＝[2,4,5,6]
const scale = scalePatternScale.map((nanatu) => {
    return scalePatternNotes[(rootIndex + nanatu)%12];
});
    //他の関数でもscaleを使えるように返す
    return scale;
};

//先程作成したスケールをテキストとして表示
const scaleUpdate = () => {
    const scale = createScale();
    console.log(`キーは${keySelect.value}、モードは${mode}に変更されました`);
    textScale.textContent = scale;
};

//コードトーンを作る関数
const createChordTone = (rootNote, chordType) => {
    const notes = mode === 'major'
    ? majorNotes
    : minorNotes;
    const rootIndex = notes.indexOf(rootNote);
    const intervals = ChordTypes[chordType];
    console.log(`notesは${notes}、rootIndexは${rootIndex}、intervalsは${intervals}`);

    const chordTones = intervals.map((interval) => {
        return notes[(rootIndex + interval)%12];
        
    });
    
    return chordTones;
};
///作成されたスケールから、I〜VIIまでのダイアトニックコードのボタンを生成する
const makeDiatonicCodeButton = () => {
    //まずはscaleを呼び出す
    const scale = createScale();
    
    buttonSpace.innerHTML = '';
    scale.forEach((aScaleTone) =>{
    const codeNumber = scale.indexOf(aScaleTone)+1;
    const degree = degreeExchange[mode][codeNumber];
    //コードタイプMmもここで区別
   


    const chordType = diatonicChordTypes[mode][codeNumber -1];
    ///コードタイプに合った名前を付与するための付加文字
    const chordTypeName = chordName[chordType];
    const chordTones = createChordTone(aScaleTone, chordType);
    const dCodeButton = `<button class="diatonic-button button ${chordType}" value="${aScaleTone}"  data-degree-number = "${codeNumber}" data-degree ="${degree}" data-chord-type="${chordType}" data-chord-tone = "${chordTones.join('-')}">${aScaleTone}${chordTypeName}</button>`;
   
    buttonSpace.insertAdjacentHTML('beforeend',dCodeButton)
}
);
};

//この関数を呼び出したとき、ダイアトニックコードの情報をまとめる＆外で使えるようにする関数
const createDiatonicChordInfo = (degreeNumber) => {
    const scale = createScale();
    const rootNote = scale[degreeNumber - 1];
    const degree = degreeExchange[mode][degreeNumber];
    const chordType = diatonicChordTypes[mode][degreeNumber - 1];
    const chordTones = createChordTone(rootNote, chordType);

    return {
        degreeNumber,//: degreeNumber,
        rootNote,//: rootNote,
        degree,//: degree,
        chordType,//: chordType,
        chordTones,//: chordTones,
    };
};
//ダイアトニックコードのおすすめを吹き出しとして表示する
const showRecommendBubble = (degreeNumber) => {
    const selectedChord = createDiatonicChordInfo(degreeNumber);
    const recommendDiatonics = connectionDcode[mode][degreeNumber] || [];

    //リコメンドを表示するエリアを空にしてクラス付与
    recommendSpace.innerHTML = '';
    recommendSpace.classList.add('is-show');
    //リコメンドのタイトル
    const title = `<div class="recommend-title">このコード ${selectedChord.rootNote} （${selectedChord.degree}）からつながるコード</div>`;
    recommendSpace.insertAdjacentHTML('beforeend', title);

    //リコメンドのリスト
    //空の<div>をここで作った
    const list = document.createElement('div');
    //divの中にクラスを付けた
    list.classList.add('recommend-list');

    recommendDiatonics.forEach((recommendDiatonic) => {
        const recommendChord = createDiatonicChordInfo(recommendDiatonic.recommend);
        const button = document.createElement('button');
        button.classList.add('recommend-button', `suggestion--${recommendDiatonic.type}`);
        button.dataset.degreeNumber = recommendDiatonic.recommend;
        button.dataset.chordType = recommendChord.chordType;
        button.dataset.chordTone = recommendChord.chordTones.join('-');
        button.innerHTML = `
            <span class="recommend-code">${recommendChord.degree} ${recommendChord.rootNote}</span>
            <span class="recommend-reason">${recommendDiatonic.reason}</span>
        `;
        //作ったbuttonをlistの子要素にする
        list.appendChild(button);
    });
    //作ったlistをrecommendSpaceの子要素にする
    recommendSpace.appendChild(list);
};

//⑤イベント登録
    //modeが変更されたときに実行
modeBtn.addEventListener('click', () => {
    if(mode === 'major'){
        mode = 'minor';
        modeBtn.textContent = 'Minor';
        modeBtn.classList.remove("major");
        modeBtn.classList.add("minor");
        keySelect.classList.remove("major");
        keySelect.classList.add("minor");
    }
    else{
        mode = 'major';
        modeBtn.textContent = 'Major';
        modeBtn.classList.remove("minor");
        modeBtn.classList.add("major"); 
        keySelect.classList.remove("minor");
        keySelect.classList.add("major");
               
    }
 
    //console.log(`モードは${mode}に変更されました`);

    //キーもしくはM/nが選ばれたら、それに適したスケールを作成し、反映する関数を実行する
    noteUpDate();
    //createScale();はScaleUpdateの中で返り値として実行されているので不要
    scaleUpdate();
    makeDiatonicCodeButton();
    recommendSpace.classList.remove('is-show');
    recommendSpace.innerHTML = '';
    //modeは関数の外にあるのでreturn不要
    
});

    //キーが変更されたときに実行する
keySelect.addEventListener('change', () => {
    //createScale();
    scaleUpdate();
    makeDiatonicCodeButton();
    recommendSpace.classList.remove('is-show');
    recommendSpace.innerHTML = '';
    
    
});

//コードボタンがクリックされたときに実行する
buttonSpace.addEventListener('click', (event) => {
    if(event.target.tagName !== 'BUTTON'){
        return; //ここで関数の実行をやめる、の意（返り値はundefined）
    }
    const button = event.target;
    const degreeNumber = Number(button.dataset.degreeNumber);
    const recommendDiatonics = connectionDcode[mode][degreeNumber] || [];
    console.log(`このコードのmodeは${button.dataset.chordType}で構成音は${button.dataset.chordTone}`);
    if(recommendDiatonics.length === 0){
        console.log('connection rule is not set yet');
        return;
    }
    recommendDiatonics.forEach((recommendDiatonic) => {
        console.log(`つながるコードは${recommendDiatonic.recommend}で、その理由は${recommendDiatonic.reason}、機能和声的な意義は${recommendDiatonic.type}`);
    });
    showRecommendBubble(degreeNumber);
} );

recommendSpace.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if(!button){
        return;
    }

    showRecommendBubble(Number(button.dataset.degreeNumber));
});

//⑥初期設定
noteUpDate();
//createScale();
scaleUpdate();
makeDiatonicCodeButton();

