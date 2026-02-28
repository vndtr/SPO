import React, { useEffect, useRef, useState } from 'react';

// текст рассказа "Тоска" А.П. Чехова для прототипа

const bookText = `Тоска

Кому повем печаль мою?..

Вечерние сумерки. Крупный мокрый снег лениво кружится около только что зажженных фонарей и тонким мягким пластом ложится на крыши, лошадиные спины, плечи, шапки. Извозчик Иона Потапов весь бел, как привидение. Он согнулся, насколько только возможно согнуться живому телу, сидит на козлах и не шевельнется. Упади на него целый сугроб, то и тогда бы, кажется, он не нашел нужным стряхивать с себя снег… Его лошаденка тоже бела и неподвижна. Своею неподвижностью, угловатостью форм и палкообразной прямизною ног она даже вблизи похожа на копеечную пряничную лошадку. Она, по всей вероятности, погружена в мысль. Кого оторвали от плуга, от привычных серых картин и бросили сюда, в этот омут, полный чудовищных огней, неугомонного треска и бегущих лошадей, тому нельзя не думать…

Иона и его лошаденка не двигаются с места уже давно. Выехали они со двора еще до обеда, а почина все нет и нет. Но вот на город спускается вечерняя мгла. Бледность фонарных огней уступает свое место живой краске, и уличная суматоха становится шумнее.

– Извозчик, на Выборгскую! – слышит Иона. – Извозчик! Иона вздрагивает и сквозь ресницы, облепленные снегом, видит военного в шинели с капюшоном.

– На Выборгскую! – повторяет военный. – Да ты спишь, что ли? На Выборгскую!

В знак согласия Иона дергает вожжи, отчего со спины лошади и с его плеч сыплются пласты снега… Военный садится в сани. Извозчик чмокает губами, вытягивает по-лебединому шею, приподнимается и больше по привычке, чем по нужде, машет кнутом. Лошаденка тоже вытягивает шею, кривит свои палкообразные ноги и нерешительно двигается с места…

– Куда прешь, леший! – на первых же порах слышит Иона возгласы из темной движущейся взад и вперед массы. – Куда черти несут? Пррава держи!

– Ты ездить не умеешь! Права держи! – сердится военный.

Бранится кучер с кареты, злобно глядит и стряхивает с рукава снег прохожий, перебегавший дорогу и налетевший плечом на морду лошаденки. Иона ерзает на козлах, как на иголках, тыкает в стороны локтями и водит глазами, как угорелый, словно не понимает, где он и зачем он здесь.

– Какие все подлецы! – острит военный. – Так и норовят столкнуться с тобой или под лошадь попасть. Это они сговорились.

Иона оглядывается на седока и шевелит губами… Хочет он, по-видимому, что-то сказать, но из горла не выходит ничего, кроме сипенья.

– Что? – спрашивает военный.

Иона кривит улыбкой рот, напрягает свое горло и сипит:

– А у меня, барин, тово… сын на этой неделе помер.

– Гм!.. Отчего же он умер?

Иона оборачивается всем туловищем к седоку и говорит:

– А кто ж его знает! Должно, от горячки… Три дня полежал в больнице и помер… Божья воля.

– Сворачивай, дьявол! – раздается в потемках. – Повылазило, что ли, старый пес! Гляди глазами!

– Поезжай, поезжай… – говорит седок. – Этак мы и до завтра не доедем. Подгони-ка!

Извозчик опять вытягивает шею, приподнимается и с тяжелой грацией взмахивает кнутом. Несколько раз потом оглядывается он на седока, но тот закрыл глаза и, по-видимому, не расположен слушать. Высадив его на Выборгской, он останавливается у трактира, сгибается на козлах и опять не шевельнется… Мокрый снег опять красит набело его и лошаденку. Проходит час, другой…

По тротуару, громко стуча калошами и перебраниваясь, проходят трое молодых людей: двое из них высоки и тонки, третий мал и горбат.

– Извозчик, к Полицейскому мосту! – кричит дребезжащим голосом горбач. – Троих… двугривенный!

Иона дергает вожжами и чмокает. Двугривенный цена не сходная, но ему не до цены… Что рубль, что пятак – для него теперь все равно, были бы только седоки… Молодые люди, толкаясь и сквернословя, подходят к саням и все трое сразу лезут на сиденье. Начинается решение вопроса: кому двум сидеть, а кому третьему стоять? После долгой перебранки, капризничанья и попреков приходят к решению, что стоять должен горбач, как самый маленький.

– Ну, погоняй! – дребезжит горбач, устанавливаясь и дыша в затылок Ионы. – Лупи! Да и шапка же у тебя, братец! Хуже во всем Петербурге не найти…

– Гы-ы… гы-ы… – хохочет Иона. – Какая есть…

– Ну ты, какая есть, погоняй! Этак ты всю дорогу будешь ехать? Да? А по шее?..

– Голова трещит… – говорит один из длинных. – Вчера у Дукмасовых мы вдвоем с Васькой четыре бутылки коньяку выпили.

– Не понимаю, зачем врать! – сердится другой длинный. – Врет, как скотина.

– Накажи меня бог, правда…

– Это такая же правда, как то, что вошь кашляет.

– Гы-ы! – ухмыляется Иона. – Ве-еселые господа!

– Тьфу, чтоб тебя черти!.. – возмущается горбач. – Поедешь ты, старая холера, или нет? Разве так ездят? Хлобысни-ка ее кнутом! Но, черт! Но! Хорошенько ее!

Иона чувствует за своей спиной вертящееся тело и голосовую дрожь горбача. Он слышит обращенную к нему ругань, видит людей, и чувство одиночества начинает мало-помалу отлегать от груди. Горбач бранится до тех пор, пока не давится вычурным, шестиэтажным ругательством и не разражается кашлем. Длинные начинают говорить о какой-то Надежде Петровне. Иона оглядывается на них. Дождавшись короткой паузы, он оглядывается еще раз и бормочет:

– А у меня на этой неделе… тово… сын помер!

– Все помрем… – вздыхает горбач, вытирая после кашля губы. – Ну, погоняй, погоняй! Господа, я решительно не могу дальше так ехать! Когда он нас довезет?

– А ты его легонечко подбодри… в шею!

– Старая холера, слышишь? Ведь шею накостыляю!.. С вашим братом церемониться, так пешком ходить!.. Ты слышишь, Змей Горыныч? Или тебе плевать на наши слова?

И Иона больше слышит, чем чувствует, звуки подзатыльника.

– Гы-ы… – смеется он. – Веселые господа… дай бог здоровья!

– Извозчик, ты женат? – спрашивает длинный.

– Я-то? Гы-ы… ве-еселые господа! Таперя у меня одна жена – сырая земля… Хи-хо-хо… Могила то есть!.. Сын-то вот помер, а я жив… Чудное дело, смерть дверью обозналась… Заместо того, чтоб ко мне идтить, она к сыну…

И Иона оборачивается, чтобы рассказать, как умер его сын, но тут горбач легко вздыхает и заявляет, что, слава богу, они наконец приехали. Получив двугривенный, Иона долго глядит вслед гулякам, исчезающим в темном подъезде. Опять он одинок, и опять наступает для него тишина… Утихшая ненадолго тоска появляется вновь и распирает грудь еще с большей силой. Глаза Ионы тревожно и мученически бегают по толпам, снующим по обе стороны улицы: не найдется ли из этих тысяч людей хоть один, который выслушал бы его? Но толпы бегут, не замечая ни его, ни тоски… Тоска громадная, не знающая границ. Лопни грудь Ионы и вылейся из нее тоска, так она бы, кажется, весь свет залила, но тем не менее ее не видно. Она сумела поместиться в такую ничтожную скорлупу, что ее не увидишь днем с огнем…

Иона видит дворника с кульком и решает заговорить с ним.

– Милый, который теперь час будет? – спрашивает он.

– Десятый… Чего же стал здесь? Проезжай!

Иона отъезжает на несколько шагов, изгибается и отдается тоске… Обращаться к людям он считает уже бесполезным. Но не проходит и пяти минут, как он выпрямляется, встряхивает головой, словно почувствовал острую боль, и дергает вожжи… Ему невмоготу.

«Ко двору, – думает он. – Ко двору!»

И лошаденка, точно поняв его мысль, начинает бежать рысцой. Спустя часа полтора Иона сидит уже около большой, грязной печи. На печи, на полу, на скамьях храпит народ. В воздухе «спираль» и духота… Иона глядит на спящих, почесывается и жалеет, что так рано вернулся домой…

«И на овес не выездил, – думает он. – Оттого-то вот и тоска. Человек, который знающий свое дело… который и сам сыт и лошадь сыта, завсегда покоен…»

В одном из углов поднимается молодой извозчик, сонно крякает и тянется к ведру с водой.

– Пить захотел? – спрашивает Иона.

– Стало быть, пить!

– Так… На здоровье… А у меня, брат, сын помер… Слыхал? На этой неделе в больнице… История!

Иона смотрит, какой эффект произвели его слова, но не видит ничего. Молодой укрылся с головой и уже спит. Старик вздыхает и чешется… Как молодому хотелось пить, так ему хочется говорить. Скоро будет неделя, как умер сын, а он еще путем не говорил ни с кем… Нужно поговорить с толком, с расстановкой… Надо рассказать, как заболел сын, как он мучился, что говорил перед смертью, как умер… Нужно описать похороны и поездку в больницу за одеждой покойника. В деревне осталась дочка Анисья… И про нее нужно поговорить… Да мало ли о чем он может теперь поговорить? Слушатель должен охать, вздыхать, причитывать… А с бабами говорить еще лучше. Те хоть и дуры, но ревут от двух слов.

«Пойти лошадь поглядеть, – думает Иона. – Спать всегда успеешь… Небось выспишься…»

Он одевается и идет в конюшню, где стоит его лошадь. Думает он об овсе, сене, о погоде… Про сына, когда один, думать он не может… Поговорить с кем-нибудь о нем можно, но самому думать и рисовать себе его образ невыносимо жутко…

– Жуешь? – спрашивает Иона свою лошадь, видя ее блестящие глаза. – Ну, жуй, жуй… Коли на овес не выездили, сено есть будем… Да… Стар уж стал я ездить… Сыну бы ездить, а не мне… То настоящий извозчик был… Жить бы только…

Иона молчит некоторое время и продолжает:

– Так-то, брат кобылочка… Нету Кузьмы Ионыча… Приказал долго жить… Взял и помер зря… Таперя, скажем, у тебя жеребеночек, и ты этому жеребеночку родная мать… И вдруг, скажем, этот самый жеребеночек приказал долго жить… Ведь жалко?

Лошаденка жует, слушает и дышит на руки своего хозяина…

Иона увлекается и рассказывает ей всё…`;


export default function SimpleTextReader({ 
    onTextSelected,      // колбэк при выделении текста
    storagePrefix = 'personal_', // префикс для localStorage (personal_ или session_)
    currentUser = null,   // текущий пользователь (для сессий)
    onNoteClick          // колбэк для прокрутки к аннотации
}) {
    // ссылки на DOM
    const containerRef = useRef(null); // ссылка на контейнер с текстом
    
    const [isLoaded, setIsLoaded] = useState(false); // флаг загрузки аннотаций

    // Удаляет элемент подсветки по его id и восстанавливает текстовый узел 
    // Вызывается из компонентов ReaderAside/SessionReaderAside при удалении аннотации
    const removeHighlight = (id) => {
        if (!containerRef.current) return;
        
        const element = document.getElementById(id);
        if (element) {
            const parent = element.parentNode;
            const text = element.textContent;
            const textNode = document.createTextNode(text);
            parent.replaceChild(textNode, element);
        }
    };

    // Ищет указанный текст в DOM и оборачивает его в span с нужными стилями
    // Используется при загрузке страницы для восстановления подсветки
    const applyHighlight = (text, color, type, id, author) => {
        if (!containerRef.current) return false;
        
        // обход DOM для поиска текстовых узлов
        // TreeWalker обходит все текстовые узлы в контейнере, позволяя найти точное место, где находится искомый текст
        const walker = document.createTreeWalker(
            containerRef.current,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(text)) {
                try {
                    // Создаём диапазон для выделенного текста
                    // Диапазон (Range) представляет выделенный фрагмент документа
                    const range = document.createRange();
                    const startPos = node.textContent.indexOf(text);
                    const endPos = startPos + text.length;
                    
                    range.setStart(node, startPos);
                    range.setEnd(node, endPos);
                    
                    // Создаём span для подсветки
                    const span = document.createElement('span');
                    span.id = id;
                    
                    // Определяем, своя это заметка или чужая (для сессий) 
                    // В личном чтении storagePrefix не содержит 'session' все заметки свои
                    // В сессии сравниваем id автора с текущим пользователем
                    const isOwn = !storagePrefix.includes('session') || 
                                 (currentUser && author && author.id === currentUser.id);
                    
                    if (type === 'quote') {
                        // Для цитат цветной фон
                        span.style.backgroundColor = 
                            color === 'yellow' ? '#fef9c3' :
                            color === 'green' ? '#bbf7d0' :
                            color === 'blue' ? '#bfdbfe' :
                            color === 'pink' ? '#fce7f3' : '#fef9c3';
                        span.className = 'highlighted-quote';
                    } else {
                        // Для заметок цветное подчёркивание
                        const borderColor = 
                            color === 'yellow' ? '#fbbf24' :
                            color === 'green' ? '#4ade80' :
                            color === 'blue' ? '#60a5fa' :
                            color === 'pink' ? '#f472b6' : '#fbbf24';
                        
                        span.style.borderBottom = `3px solid ${borderColor}`;
                        span.style.backgroundColor = 'transparent';
                        
                        // Для чужих заметок в сессии серый пунктир
                        if (storagePrefix.includes('session') && !isOwn) {
                            span.className = 'highlighted-note other-note';
                            span.style.borderBottom = '2px dashed #9ca3af';
                        } else {
                            span.className = 'highlighted-note own-note';
                        }
                    }
                    
                    span.setAttribute('data-color', color);
                    span.setAttribute('data-type', type);
                    
                    // Добавляем обработчик клика для прокрутки
                    span.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (onNoteClick) onNoteClick(id);
                    });
                    
                    // Извлекаем содержимое диапазона и вставляем span с подсветкой
                    const contents = range.extractContents();
                    span.appendChild(contents);
                    range.insertNode(span);
                    
                    return true;
                } catch (e) {
                    console.log('Ошибка применения подсветки:', e);
                    return false;
                }
            }
        }
        return false;
    };

    // загрузка сохраненных аннотаций
    const loadSavedAnnotations = () => {
        if (!containerRef.current) {
            setTimeout(loadSavedAnnotations, 100);
            return;
        }
        
        // Загружаем цитаты и заметки из localStorage с соответствующим префиксом
        const savedQuotes = JSON.parse(localStorage.getItem(`${storagePrefix}quotes`)) || {};
        const savedNotes = JSON.parse(localStorage.getItem(`${storagePrefix}notes`)) || {};
        
        // Применяем подсветку для каждой сохранённой аннотации
        Object.entries(savedQuotes).forEach(([id, quote]) => {
            if (quote.text) {
                applyHighlight(quote.text, quote.color, 'quote', id, quote.author);
            }
        });
        
        Object.entries(savedNotes).forEach(([id, note]) => {
            if (note.text) {
                applyHighlight(note.text, note.color, 'note', id, note.author);
            }
        });
        
        setIsLoaded(true);
    };

    // для загрузки аннотаций
    useEffect(() => {
        if (containerRef.current) {
            setTimeout(loadSavedAnnotations, 300);
        }
    }, [containerRef.current]);

    // Обработчик выделения текста:
    // Получаем выделение через window.getSelection()
    // Извлекаем текст и диапазон
    // Вычисляем координаты выделения через getBoundingClientRect()
    // Передаём все данные в родительский компонент
    const handleSelection = () => {
        try {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText && selectedText.length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                onTextSelected({
                    text: selectedText,
                    range: range,
                    rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка выделения:', error);
        }
    };

    // подсветка нового выделения
    const highlightSelection = (color, type, id, author) => {
        try {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            if (range.collapsed) return;
            
            const span = document.createElement('span');
            span.id = id;
            
            // Определяем авторство
            const isOwn = !storagePrefix.includes('session') || 
                         (currentUser && author && author.id === currentUser.id);
            
            if (type === 'quote') {
                span.style.backgroundColor = 
                    color === 'yellow' ? '#fef9c3' :
                    color === 'green' ? '#bbf7d0' :
                    color === 'blue' ? '#bfdbfe' :
                    color === 'pink' ? '#fce7f3' : '#fef9c3';
                span.className = 'highlighted-quote';
            } else {
                const borderColor = 
                    color === 'yellow' ? '#fbbf24' :
                    color === 'green' ? '#4ade80' :
                    color === 'blue' ? '#60a5fa' :
                    color === 'pink' ? '#f472b6' : '#fbbf24';
                
                span.style.borderBottom = `3px solid ${borderColor}`;
                span.style.backgroundColor = 'transparent';
                
                if (storagePrefix.includes('session') && !isOwn) {
                    span.className = 'highlighted-note other-note';
                    span.style.borderBottom = '2px dashed #9ca3af';
                } else {
                    span.className = 'highlighted-note own-note';
                }
            }
            
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onNoteClick) onNoteClick(id);
            });
            
            // Извлекаем содержимое и вставляем span
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
            
            selection.removeAllRanges();
        } catch (e) {
            console.log('Ошибка подсветки:', e);
        }
    };

    // прокрутка к аннотации
    const scrollToAnnotation = (noteId) => {
        const element = document.getElementById(noteId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Временная подсветка для визуального выделения
            element.classList.add('highlight-flash');
            setTimeout(() => {
                element.classList.remove('highlight-flash');
            }, 1000);
        }
    };

    // глобальные функции
    useEffect(() => {
        window.highlightSelection = highlightSelection;
        window.removeHighlight = removeHighlight;
        window.scrollToAnnotation = scrollToAnnotation;
        
        return () => {
            delete window.highlightSelection;
            delete window.removeHighlight;
            delete window.scrollToAnnotation;
        };
    }, [currentUser]);

    // стили подсветки
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .highlight-flash {
                animation: flash 1s ease;
            }
            @keyframes flash {
                0% { background-color: rgba(245, 158, 11, 0.2); }
                50% { background-color: rgba(245, 158, 11, 0.5); }
                100% { background-color: transparent; }
            }
            .highlighted-quote {
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 2px;
            }
            .highlighted-quote:hover {
                opacity: 0.8;
            }
            .highlighted-note {
                cursor: pointer;
                transition: all 0.2s;
                background-color: transparent !important;
            }
            .own-note {
                border-bottom-width: 3px;
                border-bottom-style: solid;
            }
            .other-note {
                border-bottom: 2px dashed #9ca3af;
            }
            .highlighted-note:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // разбиваем текст на абзацы
    const paragraphs = bookText.split('\n').map((p, i) => 
        p.trim() && <p key={i} className="mb-4 text-gray-700 leading-relaxed">{p}</p>
    );

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl text-blue mb-4">А.П. Чехов - Тоска</h2>
            <div 
                ref={containerRef}
                className="flex-1 overflow-y-auto p-6 bg-white rounded-lg shadow-inner"
                onMouseUp={handleSelection}
            >
                {paragraphs}
            </div>
        </div>
    );
}