
import React, { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, Play, Pause, RotateCcw, CheckCircle, XCircle, Zap, Clock, Target, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { AlgorithmType } from '../types.ts';

interface AlgoHelpModalProps {
    algorithm: AlgorithmType;
    onClose: () => void;
}

// Algorithm metadata - structured data for each algorithm
const ALGO_DATA = {
    FCFS: {
        color: 'from-blue-500 to-cyan-500',
        icon: '📋',
        complexity: 'O(n)',
        type: 'non-preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 4, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 3, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 2, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 4 },
                { id: 'P2', start: 4, end: 7 },
                { id: 'P3', start: 7, end: 9 },
            ],
            totalTime: 9
        }
    },
    SJF: {
        color: 'from-green-500 to-emerald-500',
        icon: '⚡',
        complexity: 'O(n²)',
        type: 'non-preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 6, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 2, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 4, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 6 },
                { id: 'P2', start: 6, end: 8 },
                { id: 'P3', start: 8, end: 12 },
            ],
            totalTime: 12
        }
    },
    SRTF: {
        color: 'from-purple-500 to-violet-500',
        icon: '🚀',
        complexity: 'O(n²)',
        type: 'preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 6, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 2, color: '#22c55e' },
                { id: 'P3', arrival: 3, burst: 1, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 1 },
                { id: 'P2', start: 1, end: 3 },
                { id: 'P3', start: 3, end: 4 },
                { id: 'P1', start: 4, end: 9 },
            ],
            totalTime: 9
        }
    },
    RR: {
        color: 'from-amber-500 to-orange-500',
        icon: '🔄',
        complexity: 'O(n)',
        type: 'preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 5, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 3, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 2, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 2 },
                { id: 'P2', start: 2, end: 4 },
                { id: 'P3', start: 4, end: 6 },
                { id: 'P1', start: 6, end: 8 },
                { id: 'P2', start: 8, end: 9 },
                { id: 'P1', start: 9, end: 10 },
            ],
            totalTime: 10
        }
    },
    PRIORITY: {
        color: 'from-rose-500 to-pink-500',
        icon: '🎯',
        complexity: 'O(n²)',
        type: 'non-preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 4, priority: 3, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 3, priority: 1, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 2, priority: 2, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 4 },
                { id: 'P2', start: 4, end: 7 },
                { id: 'P3', start: 7, end: 9 },
            ],
            totalTime: 9
        }
    },
    HRRN: {
        color: 'from-teal-500 to-cyan-500',
        icon: '⚖️',
        complexity: 'O(n²)',
        type: 'non-preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 3, color: '#ef4444' },
                { id: 'P2', arrival: 2, burst: 6, color: '#22c55e' },
                { id: 'P3', arrival: 4, burst: 4, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 3 },
                { id: 'P2', start: 3, end: 9 },
                { id: 'P3', start: 9, end: 13 },
            ],
            totalTime: 13
        }
    },
    PRIORITY_P: {
        color: 'from-fuchsia-500 to-pink-500',
        icon: '⚡',
        complexity: 'O(n²)',
        type: 'preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 5, priority: 3, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 3, priority: 1, color: '#22c55e' },
                { id: 'P3', arrival: 3, burst: 2, priority: 2, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 1 },
                { id: 'P2', start: 1, end: 4 },
                { id: 'P3', start: 4, end: 6 },
                { id: 'P1', start: 6, end: 10 },
            ],
            totalTime: 10
        }
    },
    LJF: {
        color: 'from-indigo-500 to-blue-500',
        icon: '📏',
        complexity: 'O(n²)',
        type: 'non-preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 2, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 6, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 4, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 2 },
                { id: 'P2', start: 2, end: 8 },
                { id: 'P3', start: 8, end: 12 },
            ],
            totalTime: 12
        }
    },
    LRTF: {
        color: 'from-red-500 to-orange-500',
        icon: '🔥',
        complexity: 'O(n²)',
        type: 'preemptive',
        example: {
            processes: [
                { id: 'P1', arrival: 0, burst: 4, color: '#ef4444' },
                { id: 'P2', arrival: 1, burst: 5, color: '#22c55e' },
                { id: 'P3', arrival: 2, burst: 2, color: '#3b82f6' },
            ],
            gantt: [
                { id: 'P1', start: 0, end: 1 },
                { id: 'P2', start: 1, end: 5 },
                { id: 'P1', start: 5, end: 8 },
                { id: 'P3', start: 8, end: 10 },
            ],
            totalTime: 10
        }
    }
};

// Translations for modal content
const MODAL_TRANSLATIONS = {
    IT: {
        tabs: { theory: 'Teoria', example: 'Esempio', proscons: 'Pro & Contro' },
        keyPoints: 'Punti Chiave',
        complexity: 'Complessità',
        type: 'Tipo',
        preemptive: 'Preemptive',
        nonPreemptive: 'Non-Preemptive',
        pros: 'Vantaggi',
        cons: 'Svantaggi',
        example: 'Esempio Animato',
        process: 'Processo',
        arrival: 'Arrivo',
        burst: 'Burst',
        priority: 'Priorità',
        playAnimation: 'Avvia Animazione',
        pauseAnimation: 'Pausa',
        resetAnimation: 'Reset',
        currentTime: 'Tempo Corrente',
        quantum: 'Quantum = 2',
        close: 'Chiudi',
        algoDetails: {
            FCFS: {
                description: 'First Come First Serve (FCFS) rappresenta il paradigma fondamentale dello scheduling nei sistemi operativi. Come suggerisce il nome, questo algoritmo implementa una politica di servizio basata sull\'ordine cronologico di arrivo: il primo processo che entra nella Ready Queue sarà il primo ad essere eseguito dalla CPU.',
                theory: `**Che cos'è FCFS e come funziona?**

FCFS (First Come First Serve) è l'algoritmo di scheduling più intuitivo che esista, perché replica esattamente ciò che accade in una fila ordinata: chi arriva prima viene servito prima. Immagina una coda al supermercato: non importa quanto sia grande o piccolo il carrello di un cliente, l'ordine di servizio dipende esclusivamente da chi è arrivato prima alla cassa.

Nel contesto di un sistema operativo, i processi vengono inseriti in una coda (chiamata Ready Queue) nell'esatto ordine in cui diventano pronti per l'esecuzione. Lo scheduler preleva sempre il processo in testa alla coda e gli assegna la CPU fino al suo completamento. Una volta terminato, il processo successivo in coda ottiene la CPU, e così via.

**Perché è definito "non-preemptive"?**

FCFS è un algoritmo non-preemptive, il che significa che una volta che un processo ottiene la CPU, la mantiene fino al termine della sua esecuzione. Nessun altro processo, indipendentemente dalla sua importanza o urgenza, può interromperlo. Questo comportamento ha sia vantaggi (semplicità, nessun overhead di cambio contesto) che svantaggi (scarsa reattività).

**Le metriche fondamentali**

Per valutare le prestazioni di qualsiasi algoritmo di scheduling, utilizziamo tre metriche chiave:

• Il Completion Time (CT) indica quando un processo termina la sua esecuzione
• Il Turnaround Time (TAT) misura il tempo totale trascorso dal momento dell'arrivo al completamento (TAT = CT - AT)
• Il Waiting Time (WT) rappresenta il tempo che un processo trascorre in attesa nella Ready Queue (WT = TAT - BurstTime)

**Il problema del Convoy Effect**

Il principale svantaggio di FCFS è il cosiddetto "effetto convoglio". Questo fenomeno si verifica quando un processo con burst time molto lungo arriva prima di diversi processi brevi. Proprio come un camion lento su una strada a corsia unica blocca tutto il traffico dietro di sé, un processo lungo in FCFS fa attendere tutti i processi successivi, anche se potrebbero completarsi in pochi millisecondi.

Per esempio: se un processo da 100 unità di tempo arriva al tempo 0, seguito da cinque processi da 1 unità ciascuno al tempo 1, questi cinque processi dovranno attendere 100 unità prima di poter iniziare, anche se insieme impiegherebbero solo 5 unità!

**Quando usare FCFS?**

FCFS è ideale nei sistemi batch dove i job hanno durate simili e non ci sono requisiti di interattività. I primi sistemi mainframe degli anni '60 utilizzavano esclusivamente questo approccio, elaborando schede perforate in sequenza durante la notte.

**Origini storiche**

L'algoritmo FCFS deriva dalla teoria delle code (Queueing Theory) formalizzata da Agner Krarup Erlang nei primi anni del 1900 per ottimizzare le reti telefoniche di Copenaghen. I suoi modelli matematici M/M/1 sono ancora oggi alla base dell'analisi delle prestazioni dei sistemi informatici.`,
                keyPoints: [
                    'Complessità temporale O(n): lo scheduler visita ogni processo una sola volta',
                    'Complessità spaziale O(n): necessaria una coda per memorizzare i processi',
                    'Non richiede alcuna informazione sul burst time dei processi',
                    'Garantisce assenza totale di starvation: ogni processo verrà eseguito',
                    'L\'ordine di esecuzione è deterministico e completamente prevedibile',
                    'Le prestazioni dipendono fortemente dall\'ordine casuale di arrivo'
                ],
                pros: [
                    'Implementazione estremamente semplice: basta una coda FIFO',
                    'Zero overhead decisionale: nessun calcolo per scegliere il prossimo processo',
                    'Massima equità procedurale: l\'ordine di arrivo è sempre rispettato',
                    'Nessun rischio di starvation: tutti i processi completano',
                    'Comportamento completamente deterministico e prevedibile',
                    'Perfetto per elaborazioni batch con job di durata uniforme'
                ],
                cons: [
                    'Tempo di attesa medio potenzialmente molto elevato',
                    'Convoy effect: processi brevi bloccati da quelli lunghi',
                    'Totalmente inadatto a sistemi interattivi o in tempo reale',
                    'Ignora qualsiasi priorità o caratteristica dei processi',
                    'Non ottimizza nessuna metrica prestazionale',
                    'Pessima reattività: i processi brevi possono aspettare a lungo'
                ]
            },
            SJF: {
                description: 'Shortest Job First (SJF), conosciuto anche come Shortest Process Next (SPN), rappresenta un approccio radicalmente diverso rispetto a FCFS. Invece di considerare quando un processo arriva, SJF si concentra su quanto tempo impiegherà: viene sempre scelto il processo che richiede meno tempo di CPU.',
                theory: `**L'idea alla base di SJF**

SJF parte da un'osservazione semplice ma potente: se devo servire più clienti e voglio minimizzare il tempo totale che tutti aspettano, conviene servire prima chi ha bisogno di meno tempo. Immagina di essere un cassiere con tre clienti in coda: uno deve pagare 20 articoli, uno 5 articoli e uno solo 1 articolo. Se servi prima quello con 20 articoli, gli altri due aspetteranno tantissimo. Se invece servi prima quello con 1 articolo, poi quello con 5 e infine quello con 20, il tempo totale di attesa sarà minimo.

Questo principio, tradotto nello scheduling dei processi, ci dice di eseguire sempre il processo con il burst time più breve tra quelli pronti nella Ready Queue.

**Perché SJF è matematicamente ottimale**

SJF non è solo un'euristica ragionevole: è dimostrabilmente l'algoritmo ottimale per minimizzare il tempo di attesa medio. La dimostrazione è intuitiva: ogni volta che spostiamo un processo breve prima di uno lungo, riduciamo l'attesa totale perché il processo breve "blocca" gli altri per meno tempo.

Questa proprietà rende SJF il benchmark teorico con cui confrontare tutti gli altri algoritmi: nessun algoritmo non-preemptive può fare meglio in termini di tempo di attesa medio.

**Il problema della conoscenza del futuro**

C'è un problema fondamentale con SJF: come facciamo a sapere quanto durerà un processo prima che inizi? In un sistema reale, il burst time non è noto a priori. È come se il cassiere dovesse indovinare quanti articoli ha ogni cliente nel carrello senza poterli vedere!

Per questo motivo, nei sistemi reali si usano tecniche di predizione. La più comune è la media esponenziale ponderata: si stima il prossimo burst time come una combinazione del burst effettivo precedente e della stima precedente. Con questa formula, il sistema "impara" dal comportamento passato di ogni processo.

**Il rischio di starvation**

Il lato oscuro di SJF è la starvation (letteralmente "morte per fame"). Se arrivano continuamente processi brevi, un processo lungo potrebbe non ottenere mai la CPU. In teoria, potrebbe aspettare all'infinito!

Questo rende SJF inadatto a sistemi dove tutti i processi devono garantire un tempo di completamento limitato. La soluzione tipica è l'aging: aumentare gradualmente la priorità di un processo in base a quanto tempo ha aspettato.

**Quando usare SJF**

SJF è ideale in ambienti batch dove i job hanno burst time noti o stimabili, e dove la priorità assoluta è minimizzare il tempo di attesa medio. È meno adatto a sistemi interattivi dove la reattività e l'equità sono prioritarie.`,
                keyPoints: [
                    'Complessità O(n²) con ricerca lineare, O(n log n) con strutture ottimizzate',
                    'Dimostrabilmente ottimale: nessun altro algoritmo ha AWT inferiore',
                    'Richiede conoscenza o stima accurata del burst time',
                    'Rischio di starvation per processi con burst time lungo',
                    'Bias intrinseco: favorisce sistematicamente i processi brevi',
                    'Benchmark teorico per valutare altri algoritmi di scheduling'
                ],
                pros: [
                    'Tempo di attesa medio minimo possibile tra gli algoritmi non-preemptive',
                    'Massimizza il throughput: più processi completati per unità di tempo',
                    'I processi brevi ottengono risposta rapida',
                    'Ottimo per sistemi batch con workload prevedibile',
                    'Fondamento teorico per algoritmi più avanzati',
                    'Risultati eccellenti quando burst time sono noti o stimabili'
                ],
                cons: [
                    'Starvation: i processi lunghi potrebbero attendere indefinitamente',
                    'Richiede predizione del burst time, raramente disponibile',
                    'Overhead computazionale per trovare il minimo',
                    'Non preemptive: un processo lungo blocca comunque la CPU',
                    'Percepito come ingiusto dai processi CPU-intensive',
                    'Difficile applicazione pratica senza informazioni sui processi'
                ]
            },
            SRTF: {
                description: 'Shortest Remaining Time First (SRTF), noto anche come Preemptive SJF, porta il concetto di SJF al suo estremo logico: non solo scegliamo il processo più breve, ma siamo disposti a interrompere qualsiasi processo in esecuzione se ne arriva uno ancora più breve.',
                theory: `**SRTF: l'evoluzione preemptive di SJF**

SRTF rappresenta la versione "aggressiva" di SJF. Mentre SJF aspetta che un processo termini prima di sceglierne un altro, SRTF è pronto a interrompere il processo corrente in qualsiasi momento se arriva un nuovo processo con tempo residuo inferiore.

L'idea è semplice: se stai servendo un cliente che ha bisogno di altri 10 minuti, e arriva un cliente che ha bisogno solo di 1 minuto, smetti di servire il primo (mettendolo temporaneamente in pausa) e servi subito il secondo. In questo modo, il secondo cliente non deve aspettare 10 minuti per una questione di 1 minuto.

**Il concetto di "tempo residuo"**

La differenza fondamentale tra SJF e SRTF sta in cosa viene confrontato. SJF confronta il burst time totale dei processi, mentre SRTF confronta il tempo residuo (remaining time): quanto tempo manca al completamento di ogni processo.

Per esempio: un processo con burst time di 10 unità che ha già eseguito per 8 unità ha un tempo residuo di sole 2 unità. Se arriva un nuovo processo con burst time di 3 unità, il processo corrente NON viene interrotto (2 < 3). Ma se il nuovo processo avesse burst time di 1 unità, allora SÌ, avverrebbe preemption.

**L'algoritmo ottimale assoluto**

SRTF è l'algoritmo dimostrabilmente ottimale in assoluto per minimizzare il tempo di attesa medio. Questo significa che, tra tutti gli algoritmi di scheduling possibili (preemptive e non), nessuno può fare meglio di SRTF in termini di tempo di attesa medio.

Questa è una proprietà teorica estremamente importante: SRTF rappresenta il limite teorico delle prestazioni. Qualsiasi altro algoritmo può solo sperare di avvicinarsi alle sue prestazioni, mai superarle.

**Il costo della perfezione: context switch**

La perfezione ha un prezzo. Ogni volta che SRTF interrompe un processo per eseguirne un altro, deve effettuare un context switch: salvare lo stato completo del processo corrente (registri CPU, program counter, stack, stato della memoria) e caricare quello del nuovo processo.

Questo richiede tempo (tipicamente 1-10 microsecondi sui processori moderni) e inquina le cache, rallentando l'esecuzione successiva. In scenari con molti arrivi frequenti di processi brevi, l'overhead dei context switch può diventare significativo.

**Starvation amplificata**

Se SJF ha un problema di starvation, SRTF lo amplifica. In SJF, almeno una volta che un processo lungo inizia l'esecuzione, può completare indisturbato. In SRTF, un processo lungo può essere interrotto continuamente da processi brevi che arrivano, facendo potenzialmente zero progresso per lunghi periodi.

Questo rende SRTF ancora più problematico in scenari dove la garanzia di completamento è importante.

**Applicazioni pratiche**

Nonostante le sue proprietà teoriche ideali, SRTF raramente viene usato nella sua forma pura in sistemi reali. I problemi di starvation, l'overhead dei context switch e la necessità di conoscere il tempo residuo lo rendono impraticabile. Tuttavia, molti scheduler moderni prendono ispirazione dai suoi principi per ottimizzare le prestazioni.`,
                keyPoints: [
                    'Algoritmo dimostrabilmente ottimale: impossibile fare meglio per AWT',
                    'Preemption basata sul tempo residuo, non sul burst time totale',
                    'Richiede conoscenza continua del tempo residuo di ogni processo',
                    'Overhead di context switch potenzialmente molto elevato',
                    'Starvation ancora più severa che in SJF',
                    'Standard teorico per valutare qualsiasi altro algoritmo'
                ],
                pros: [
                    'Tempo di attesa medio minimo in assoluto tra tutti gli algoritmi',
                    'Risposta immediata per processi brevi, anche se arrivano tardi',
                    'Throughput teoricamente massimo',
                    'I processi brevi non aspettano mai processi lunghi',
                    'Benchmark teorico perfetto per confronti',
                    'Massima reattività per workload dinamici'
                ],
                cons: [
                    'Overhead context switch può annullare i vantaggi teorici',
                    'Starvation estrema per processi lunghi',
                    'Richiede tracking continuo del tempo residuo (irrealistico)',
                    'Complessità implementativa significativa',
                    'Processi lunghi possono fare zero progresso per lunghi periodi',
                    'Raramente usato in pratica nella sua forma pura'
                ]
            },
            RR: {
                description: 'Round Robin (RR) rappresenta una filosofia completamente diversa rispetto a SJF e SRTF. Invece di cercare di ottimizzare le prestazioni, RR si concentra sull\'equità: ogni processo riceve la stessa porzione di tempo CPU, indipendentemente dalla sua durata o importanza.',
                theory: `**L'idea del time-sharing equo**

Round Robin nasce da un concetto semplice e democratico: tutti i processi meritano attenzione equa. Immagina una tavola rotonda dove ogni partecipante può parlare per esattamente 2 minuti, poi deve cedere la parola al prossimo. Non importa se qualcuno ha molto da dire o poco: tutti ottengono lo stesso tempo.

Nel contesto dello scheduling, ogni processo riceve un "quantum" di tempo (tipicamente 10-100 millisecondi) durante il quale può usare la CPU. Quando il quantum scade, il processo viene interrotto (preemption) e spostato in fondo alla coda, mentre il prossimo processo in coda ottiene il suo turno.

**La scelta del quantum: un trade-off cruciale**

La dimensione del quantum è probabilmente la decisione più importante nella configurazione di Round Robin, perché influenza profondamente le prestazioni del sistema.

Se il quantum è troppo grande, Round Robin si comporta essenzialmente come FCFS. Immagina un quantum di 1 ora: praticamente ogni processo finirebbe prima che il quantum scada, quindi non ci sarebbe mai preemption.

Se il quantum è troppo piccolo, il sistema passerà più tempo a cambiare contesto che a eseguire effettivamente i processi. Un quantum di 1 microsecondo significherebbe fare milioni di context switch al secondo!

La regola empirica suggerisce di scegliere un quantum tale che circa l'80% dei burst dei processi sia più breve del quantum. In sistemi moderni, valori tipici vanno da 10 a 100 millisecondi.

**Il response time garantito**

Una delle proprietà più importanti di Round Robin è la garanzia sul response time. Se ci sono n processi nel sistema e il quantum è Q, il tempo massimo che un processo deve aspettare prima di ottenere il suo prossimo turno è (n-1) × Q.

Questa prevedibilità è fondamentale per i sistemi interattivi: un utente che preme un tasto vuole vedere una risposta entro tempi ragionevoli, non dopo che un processo pesante ha monopolizzato la CPU per minuti.

**Perché RR elimina la starvation**

Una delle più grandi virtù di Round Robin è l'impossibilità di starvation. Ogni processo, indipendentemente dalle sue caratteristiche, ottiene regolarmente il suo turno di CPU. Non esistono "cittadini di serie B" in Round Robin.

Questo contrasta nettamente con SJF e SRTF, dove un processo lungo potrebbe teoricamente non essere mai eseguito.

**I limiti di RR**

Il prezzo dell'equità è l'inefficienza. Round Robin non considera affatto le caratteristiche dei processi: un processo che ha bisogno di 1 millisecondo viene trattato esattamente come uno che ha bisogno di 1 ora. Questo può portare a tempi di attesa medi significativamente più alti rispetto a SJF.

Inoltre, l'overhead dei context switch è proporzionale al numero di processi diviso per il quantum. Con molti processi e quantum piccolo, l'overhead può diventare significativo.

**Round Robin nei sistemi moderni**

Nonostante le sue limitazioni, Round Robin rimane alla base di molti scheduler moderni. Il Completely Fair Scheduler (CFS) di Linux, per esempio, è essenzialmente una versione sofisticata di Round Robin che tiene traccia di quanto tempo CPU ogni processo ha ricevuto e bilancia dinamicamente l'allocazione.`,
                keyPoints: [
                    'Complessità O(1) per decisione: basta prendere il prossimo dalla coda',
                    'Quantum tipico: 10-100ms, cruciale per le prestazioni',
                    'Garantisce che ogni processo avanzi regolarmente',
                    'Response time massimo prevedibile: (n-1) × quantum',
                    'Context switch deterministico: avviene ogni quantum',
                    'Fondamento degli scheduler moderni come Linux CFS'
                ],
                pros: [
                    'Equità assoluta: ogni processo riceve la stessa attenzione',
                    'Starvation impossibile: tutti i processi progrediscono',
                    'Response time garantito e prevedibile',
                    'Ideale per sistemi interattivi multi-utente',
                    'Implementazione semplice con una coda circolare',
                    'Scala bene con l\'aumento del numero di processi'
                ],
                cons: [
                    'Overhead di context switch può essere elevato',
                    'Tempo di attesa medio peggiore di SJF',
                    'Le prestazioni dipendono molto dalla scelta del quantum',
                    'Non considera priorità né durata dei processi',
                    'Processi brevi potrebbero aspettare troppo con quantum piccoli',
                    'Inefficiente quando i processi hanno esigenze molto diverse'
                ]
            },
            PRIORITY: {
                description: 'Priority Scheduling introduce un concetto fondamentale che gli altri algoritmi ignorano: non tutti i processi sono uguali. Alcuni sono più importanti di altri e meritano di essere eseguiti prima, indipendentemente dal loro ordine di arrivo o dalla loro durata.',
                theory: `**Il concetto di priorità nello scheduling**

Priority Scheduling parte da un'osservazione molto pratica: nel mondo reale, alcune cose sono più urgenti di altre. In un ospedale, un paziente con un infarto viene trattato prima di qualcuno con un raffreddore, indipendentemente da chi è arrivato prima o da quanto tempo richiederà il trattamento.

Allo stesso modo, nel sistema operativo alcuni processi sono più critici di altri. Un processo che gestisce l'input da tastiera deve rispondere immediatamente, mentre un processo di backup può aspettare. Priority Scheduling permette di codificare queste differenze assegnando un valore numerico di priorità a ogni processo.

**Priorità alta o bassa: le convenzioni variano**

Un punto che confonde molti studenti: in alcuni sistemi, numeri più alti significano priorità più alta; in altri, numeri più bassi significano priorità più alta. Nel nostro simulatore, usiamo la seconda convenzione: priorità 1 è la più alta, priorità 10 è più bassa.

Questa convenzione deriva da Unix, dove il comando "nice" permette ai processi di essere "gentili" con gli altri dando loro più priorità. Un valore nice alto significa "sono gentile, lascio passare gli altri prima di me".

**Priorità statica vs dinamica**

La priorità può essere assegnata in due modi fondamentalmente diversi:

La priorità statica viene assegnata quando il processo viene creato e non cambia mai. È semplice da implementare ma rischia di essere troppo rigida.

La priorità dinamica cambia nel tempo in base a vari fattori. La tecnica più comune è l'aging (invecchiamento): la priorità di un processo aumenta gradualmente in base a quanto tempo ha aspettato. Questo risolve il problema della starvation, perché anche un processo a bassa priorità eventualmente diventerà abbastanza "anziano" da ottenere la CPU.

**Il problema dell'inversione di priorità**

L'inversione di priorità è uno dei bug più insidiosi nello scheduling. Si verifica quando un processo ad alta priorità deve aspettare un processo a bassa priorità. Come può succedere?

Immagina tre processi: A (alta priorità), M (media), B (bassa). B acquisisce un lock su una risorsa condivisa, poi viene interrotto da M che ha priorità maggiore. A arriva e vuole il lock tenuto da B, ma non può procedere. M continua a eseguire impedendo a B di rilasciare il lock, e A (che ha la priorità più alta!) aspetta sia M che B!

Questo bug causò nel 1997 il reset del Mars Pathfinder mentre era su Marte. Fu risolto con il Priority Inheritance Protocol: quando A aspetta B, B "eredita" temporaneamente la priorità di A.

**Scheduler multi-livello**

Nei sistemi operativi reali, il Priority Scheduling viene spesso combinato con altri algoritmi in architetture multi-livello. Per esempio, Linux usa il Completely Fair Scheduler per processi normali ma mantiene una coda separata ad alta priorità per processi real-time che usano FIFO o Round Robin.

**Applicazioni nei sistemi real-time**

Priority Scheduling è essenziale nei sistemi real-time dove alcuni task hanno deadline assolute. Algoritmi come Rate Monotonic Scheduling (RMS) assegnano automaticamente priorità più alte ai task con periodi più brevi, garantendo matematicamente che tutte le deadline siano rispettate se il carico CPU totale non supera una certa soglia.`,
                keyPoints: [
                    'Complessità O(n) con ricerca lineare, O(log n) con strutture heap',
                    'Priorità può essere statica (immutabile) o dinamica (cambia nel tempo)',
                    'Senza aging, processi a bassa priorità rischiano starvation indefinita',
                    'Inversione di priorità è un rischio reale (caso Mars Pathfinder)',
                    'Fondamentale per sistemi real-time con deadline stringenti',
                    'Base per architetture di scheduling multi-livello moderne'
                ],
                pros: [
                    'Controllo totale sull\'ordine di esecuzione dei processi',
                    'I processi critici vengono sempre eseguiti per primi',
                    'Adattabile perfettamente a requisiti real-time',
                    'Flessibile: la priorità dinamica risolve molti problemi',
                    'Permette classi di servizio differenziate (batch, interattivo, real-time)',
                    'Combinabile con altri algoritmi in architetture ibride'
                ],
                cons: [
                    'Starvation per processi a bassa priorità senza contromisure',
                    'Inversione di priorità richiede protocolli complessi (PIP, PCP)',
                    'Difficile determinare le priorità ottimali a priori',
                    'Overhead computazionale per la gestione dell\'aging',
                    'Può essere percepito come ingiusto dagli utenti',
                    'La configurazione corretta richiede analisi approfondita del workload'
                ]
            },
            HRRN: {
                description: 'Highest Response Ratio Next (HRRN) è un algoritmo che bilancia equità ed efficienza calcolando un rapporto di risposta per ogni processo, favorendo quelli che aspettano da più tempo proporzionalmente al loro burst time.',
                theory: `**Il Rapporto di Risposta: Matematica dell'Equità**

HRRN è un algoritmo progettato per correggere il difetto fatale di SJF (Shortest Job First), ovvero la starvation. Per farlo, introduce il concetto di "Response Ratio" (R), un valore dinamico ricalcolato ad ogni decisione di scheduling.

La formula è: **R = (W + S) / S**

dove:
• **W** (Waiting Time) = Tempo trascorso dal processo in attesa nella ready queue
• **S** (Service Time) = Burst time stimato del processo

**Come funziona l'Aging Implicito**

Analizzando la formula, notiamo due comportamenti interessanti:
1. Se il denominatore S è piccolo (processo breve), R tende ad essere grande. Questo preserva la preferenza per i job brevi tipica di SJF.
2. Se il numeratore W cresce (il processo aspetta), R cresce linearmente.

Questo secondo punto è cruciale: anche un processo lunghissimo, se aspetta abbastanza a lungo, avrà un valore W talmente alto che il suo rapporto R supererà quello dei nuovi processi brevi in arrivo. È un meccanismo di "aging" (invecchiamento) automatico e matematicamente garantito.

**Esempio Numerico**

Immagina un processo P1 (burst 10) che aspetta da 50 unità di tempo.
R(P1) = (50 + 10) / 10 = 6.

Ora arriva P2 (burst 1). Essendo appena arrivato, W=0.
R(P2) = (0 + 1) / 1 = 1.

Nonostante P2 sia piccolissimo, P1 ha accumulato abbastanza "diritto di prelazione" da essere eseguito prima. Questo dimostra come l'algoritmo bilanci dinamicamente la "fame" di CPU dei processi vecchi con l'efficienza di servire quelli brevi.

**Vantaggi Rispetto a SJF**

HRRN offre il meglio dei due mondi:
• Mantiene un throughput elevato servendo rapidamente i job brevi.
• Non richiede parametri di configurazione arbitrari per l'aging.
• Garantisce matematicamente che nessun processo attenda all'infinito.

**Il Costo Computazionale**

Il prezzo da pagare è la complessità. In FCFS non si calcola nulla. In SJF si cerca il minimo. In HRRN, ogni volta che la CPU si libera, bisogna aggiornare W per *tutti* i processi in attesa e ricalcolare R. Su sistemi con migliaia di processi, questo overhead può diventare non trascurabile.`,
                keyPoints: [
                    'Response Ratio = (Waiting Time + Burst Time) / Burst Time',
                    'Elimina la starvation: il response ratio aumenta con l\'attesa',
                    'Non-preemptive: una volta avviato, il processo completa',
                    'Bilancia efficienza ed equità automaticamente',
                    'Non richiede parametri di configurazione come l\'aging',
                    'Complessità O(n²) per calcolare tutti i rapporti'
                ],
                pros: [
                    'Elimina completamente la starvation',
                    'Mantiene buone prestazioni come SJF',
                    'Bilancio automatico tra processi brevi e lunghi',
                    'Non richiede configurazione di aging esplicita',
                    'Favorisce comunque i processi brevi',
                    'Percepito come più equo dagli utenti'
                ],
                cons: [
                    'Overhead computazionale: deve calcolare il rapporto per ogni processo',
                    'Richiede conoscenza del burst time',
                    'Non-preemptive: processi lunghi bloccano la CPU',
                    'Più complesso da implementare rispetto a FCFS',
                    'Prestazioni inferiori a SJF puro in scenari senza starvation',
                    'Non adatto a sistemi real-time'
                ]
            },
            PRIORITY_P: {
                description: 'Priority Scheduling Preemptive è la versione con prelazione dello scheduling a priorità. Quando arriva un processo con priorità più alta, il processo corrente viene immediatamente interrotto.',
                theory: `**Preemption basata sulla Priorità**

A differenza della versione non-preemptive, Priority Preemptive è un algoritmo "aggressivo". Lo scheduler non aspetta che un processo termini o si blocchi volontariamente per I/O. Ad ogni singolo istante in cui arriva un nuovo processo nella Ready Queue, lo scheduler confronta la priorità del nuovo arrivato con quella del processo attualmente in esecuzione.

Se (Priorità_Nuovo < Priorità_Corrente), avviene il context switch immediato. Ricordiamo che nel nostro sistema, numero più basso = priorità più alta.

**L'essenza dei Sistemi Real-Time**

Questo comportamento non è solo un'ottimizzazione: è una necessità assoluta per i sistemi operativi Real-Time (RTOS). Pensa all'ABS di un'auto: quando i sensori rilevano il bloccaggio delle ruote, il processo che controlla i freni deve essere eseguito **subito**, interrompendo qualsiasi altra cosa (come l'aggiornamento del display della radio).

In un sistema non-preemptive, il processo dell'ABS dovrebbe aspettare che la radio finisca di aggiornare lo schermo. In un'auto a 100 km/h, quei millisecondi di ritardo potrebbero essere fatali. Priority Preemptive garantisce che il task critico ottenga la CPU nell'istante stesso in cui diventa pronto.

**Il Problema dell'Inversione di Priorità (Priority Inversion)**

La versione preemptive soffre acutamente di un problema noto come Inversione di Priorità.
Scenario:
• Task L (Low priority) ottiene un lock su una risorsa condivisa.
• Task H (High priority) arriva, fa preemption su L, e prova ad acquisire lo stesso lock.
• H si blocca perché il lock è occupato.
• Task M (Medium priority) arriva. Ha priorità > L, quindi fa preemption su L.
• Risultato: M esegue, L non può rilasciare il lock, e H (il più importante!) aspetta M.

Inosservato, un task di media importanza sta bloccando un task critico. Questo scenario richiede protocolli avanzati come il **Priority Inheritance** (L eredita temporaneamente la priorità di H) per essere risolto.

**Overhead di Context Switch**

La reattività ha un costo. Un sistema molto carico con frequenti arrivi di processi ad alta priorità può cadere nel "thrashing", dove la CPU spende più tempo a salvare e ripristinare contesti che a eseguire lavoro utile.`,
                keyPoints: [
                    'Preemption immediata per processi a priorità più alta',
                    'Ideale per sistemi real-time con deadline stringenti',
                    'Inversione di priorità richiede gestione esplicita',
                    'Context switch frequenti possono aumentare l\'overhead',
                    'Starvation possibile per processi a bassa priorità',
                    'Usato nei kernel di sistemi operativi moderni'
                ],
                pros: [
                    'Risposta immediata per processi critici',
                    'Ideale per sistemi real-time',
                    'Garantisce che i task urgenti non aspettino',
                    'Flessibile con priorità dinamiche',
                    'Permette deadline garantite',
                    'Standard per interrupt handling'
                ],
                cons: [
                    'Starvation severa per basse priorità',
                    'Overhead di context switch elevato',
                    'Inversione di priorità più problematica',
                    'Richiede protocolli complessi (PIP, PCP)',
                    'Difficile determinare priorità ottimali',
                    'Processi lunghi a bassa priorità possono non completare mai'
                ]
            },
            LJF: {
                description: 'Longest Job First (LJF) è l\'opposto di SJF: seleziona sempre il processo con il burst time più lungo. Sebbene controintuitivo, è utile per studi comparativi.',
                theory: `**La Logica del "Caso Peggiore"**

Longest Job First (LJF) è un algoritmo controintuitivo: perché mai dovremmo voler eseguire prima i processi più lunghi? Sembra una ricetta per il disastro. E infatti, in quasi tutti i sistemi interattivi moderni, lo è. Ma il suo studio è fondamentale perché rappresenta lo "stress test" teorico per eccellenza.

**Analisi del Throughput**

Mentre SJF massimizza il numero di job completati per unità di tempo, LJF fa l'esatto opposto.
Immagina un job lungo (1000s) e 10 job brevi (1s ciascuno).
• SJF completa i 10 job brevi in 10s. Utilità immediata per 10 utenti.
• LJF costringe i 10 utenti ad aspettare 1000s + esecuzione.
Il throughput del sistema crolla drammaticamente nelle fasi iniziali.

**L'Utilità in Sistemi Ibridi e Batch**

Esistono tuttavia scenari di nicchia dove LJF ha senso. Considera un sistema di rendering grafico dove i job brevi sono anteprime e i job lunghi sono render finali 8K.
Se il sistema usasse SJF, i render 8K verrebbero continuamente rimandati (starvation) dalle continue richieste di anteprima degli utenti. Usando LJF (o meccanismi ispirati ad esso), si garantisce che i "pesi massimi" vengano processati, mentre le anteprime possono aspettare leggermente di più.

Inoltre, se il sistema deve gestire risorse saturate I/O vs CPU bound, a volte dare priorità ai job lunghi (spesso CPU bound) permette di tenere la CPU occupata mentre i job brevi (spesso I/O bound) aspettano brevemente, migliorando l'utilizzo globale delle risorse in condizioni specifiche.

**Il Convoglio Rovesciato**

In FCFS, un processo lungo blocca gli altri casualmente. In LJF, il blocco è sistematico e garantito. È la dimostrazione accademica perfetta di come una politica di scheduling possa distruggere la reattività di un sistema se non allineata con gli obiettivi dell'utente.`,
                keyPoints: [
                    'Seleziona il processo con burst time più lungo',
                    'Opposto di SJF: massimizza il tempo di attesa medio',
                    'Utile per studi comparativi e benchmarking',
                    'Non-preemptive: il processo completa prima di cedere',
                    'Processi brevi soffrono di tempi di attesa molto elevati',
                    'Raramente usato in pratica'
                ],
                pros: [
                    'Job lunghi hanno priorità garantita',
                    'Utile per benchmark e confronti teorici',
                    'Implementazione semplice',
                    'Prevedibile: si conosce l\'ordine di esecuzione',
                    'Nessun rischio di starvation per job lunghi',
                    'Può essere utile in sistemi batch specifici'
                ],
                cons: [
                    'Tempo di attesa medio massimo',
                    'Processi brevi attendono enormemente',
                    'Throughput pessimo',
                    'Totalmente inadatto a sistemi interattivi',
                    'Richiede conoscenza del burst time',
                    'Genera il massimo insoddisfazione per processi brevi'
                ]
            },
            LRTF: {
                description: 'Longest Remaining Time First (LRTF) è la versione preemptive di LJF. Seleziona sempre il processo con il tempo residuo più lungo, interrompendo se necessario.',
                theory: `**L'Anti-Ottimizzazione**

Se SRTF è l'algoritmo matematicamente ottimale per *minimizzare* il tempo di attesa medio, LRTF (Longest Remaining Time First) è l'algoritmo che tende a *massimizzarlo*. È lo "specchio oscuro" di SRTF. Studiarlo ci aiuta a comprendere i limiti inferiori delle prestazioni di un sistema.

**Comportamento Dinamico e Thrashing**

LRTF ha un comportamento patologico unico: tende a portare tutti i processi a terminare quasi contemporaneamente.
Immagina due processi, A (100s) e B (90s).
1. LRTF esegue A finché il suo tempo residuo non scende sotto 90s (quindi per 10s).
2. Ora A=90s, B=90s.
3. LRTF inizierà ad alternarli continuamente (o a ogni quantum micro-scopico), mantenendoli pari.
4. Se arriva C (50s), dovrà aspettare che A e B scendano entrambi a 50s.

Il risultato? Invece di far uscire B dal sistema rapidamente, LRTF lo trattiene fino alla fine. La "Multiprogrammazione" è massima, ma il "Turnaround Time" medio esplode.

**Massimizzazione del Parallelismo (Teorico)**

Un vantaggio teorico sottile esiste: LRTF tende a tenere attivi il maggior numero possibile di processi per il maggior tempo possibile. In sistemi paralleli complessi dove i processi subiscono fasi di I/O, mantenerli tutti "vivi" ma lenti potrebbe (in casi rari e specifici) aumentare le probabilità di trovare lavoro utile da fare quando un processo si blocca. Tuttavia, su una CPU single-core, è quasi sempre la scelta peggiore.

**Conclusione Accademica**

LRTF è importante non per essere usato, ma per essere evitato. Dimostra come l'eccesso di "equità" nel distribuire il ritardo (tutti aspettano insieme) sia spesso preferibile all'equità di servizio nei sistemi time-sharing reali.`,
                keyPoints: [
                    'Versione preemptive di LJF',
                    'Seleziona il processo con tempo residuo più lungo',
                    'Massimizza intenzionalmente il tempo di attesa medio',
                    'Processi brevi soffrono enormemente',
                    'Molti context switch possibili',
                    'Strumento principalmente accademico'
                ],
                pros: [
                    'Job lunghi hanno sempre la CPU',
                    'Utile per confronti con SRTF',
                    'Strumento didattico efficace',
                    'Mostra l\'estremo opposto dell\'ottimizzazione',
                    'Preemptive: può rispondere a nuovi arrivi',
                    'Benchmark per worst-case performance'
                ],
                cons: [
                    'Tempo di attesa medio massimo possibile',
                    'Processi brevi possono attendere indefinitamente',
                    'Overhead di context switch elevato',
                    'Totalmente impraticabile in produzione',
                    'Starvation garantita per processi brevi',
                    'Prestazioni pessime in tutti gli scenari reali'
                ]
            }
        }
    },
    EN: {
        tabs: { theory: 'Theory', example: 'Example', proscons: 'Pros & Cons' },
        keyPoints: 'Key Points',
        complexity: 'Complexity',
        type: 'Type',
        preemptive: 'Preemptive',
        nonPreemptive: 'Non-Preemptive',
        pros: 'Advantages',
        cons: 'Disadvantages',
        example: 'Animated Example',
        process: 'Process',
        arrival: 'Arrival',
        burst: 'Burst',
        priority: 'Priority',
        playAnimation: 'Play Animation',
        pauseAnimation: 'Pause',
        resetAnimation: 'Reset',
        currentTime: 'Current Time',
        quantum: 'Quantum = 2',
        close: 'Close',
        algoDetails: {
            FCFS: {
                description: 'First Come First Serve (FCFS) represents the fundamental paradigm of scheduling in operating systems. As the name suggests, this algorithm implements a service policy based on chronological arrival order: the first process entering the Ready Queue will be the first one executed by the CPU.',
                theory: `**What is FCFS and how does it work?**

FCFS (First Come First Serve) is the most intuitive scheduling algorithm that exists, because it replicates exactly what happens in an orderly queue: whoever arrives first gets served first. Imagine a supermarket checkout line: it doesn't matter how big or small a customer's cart is, the order of service depends exclusively on who arrived at the register first.

In the context of an operating system, processes are inserted into a queue (called the Ready Queue) in the exact order they become ready for execution. The scheduler always picks the process at the head of the queue and assigns it the CPU until completion. Once finished, the next process in queue gets the CPU, and so on.

**Why is it called "non-preemptive"?**

FCFS is a non-preemptive algorithm, which means that once a process gets the CPU, it keeps it until its execution is complete. No other process, regardless of its importance or urgency, can interrupt it. This behavior has both advantages (simplicity, no context switch overhead) and disadvantages (poor responsiveness).

**The fundamental metrics**

To evaluate the performance of any scheduling algorithm, we use three key metrics:

• Completion Time (CT) indicates when a process finishes its execution
• Turnaround Time (TAT) measures the total time elapsed from arrival to completion (TAT = CT - AT)
• Waiting Time (WT) represents the time a process spends waiting in the Ready Queue (WT = TAT - BurstTime)

**The Convoy Effect problem**

The main disadvantage of FCFS is the so-called "convoy effect". This phenomenon occurs when a process with a very long burst time arrives before several short processes. Just like a slow truck on a single-lane road blocks all traffic behind it, a long process in FCFS makes all subsequent processes wait, even if they could complete in just a few milliseconds.

For example: if a process requiring 100 time units arrives at time 0, followed by five processes requiring 1 unit each at time 1, these five processes will have to wait 100 units before they can start, even though together they would only take 5 units!

**When to use FCFS?**

FCFS is ideal in batch systems where jobs have similar durations and there are no interactivity requirements. The early mainframe systems of the 1960s exclusively used this approach, processing punch cards in sequence overnight.

**Historical origins**

The FCFS algorithm derives from Queueing Theory formalized by Agner Krarup Erlang in the early 1900s to optimize Copenhagen's telephone networks. His M/M/1 mathematical models are still the foundation of computer system performance analysis today.`,
                keyPoints: [
                    'Time complexity O(n): the scheduler visits each process only once',
                    'Space complexity O(n): a queue is needed to store processes',
                    'No information about process burst time required',
                    'Guarantees complete absence of starvation: every process will be executed',
                    'Execution order is deterministic and completely predictable',
                    'Performance heavily depends on the random arrival order'
                ],
                pros: [
                    'Extremely simple implementation: just a FIFO queue',
                    'Zero decision overhead: no calculation to choose next process',
                    'Maximum procedural fairness: arrival order always respected',
                    'No starvation risk: all processes complete',
                    'Completely deterministic and predictable behavior',
                    'Perfect for batch processing with uniform job duration'
                ],
                cons: [
                    'Potentially very high average waiting time',
                    'Convoy effect: short processes blocked by long ones',
                    'Totally unsuitable for interactive or real-time systems',
                    'Ignores any priority or process characteristics',
                    'Does not optimize any performance metric',
                    'Poor responsiveness: short processes may wait a long time'
                ]
            },
            SJF: {
                description: 'Shortest Job First (SJF), also known as Shortest Process Next (SPN), represents a radically different approach compared to FCFS. Instead of considering when a process arrives, SJF focuses on how long it will take: the process requiring the least CPU time is always chosen.',
                theory: `**The idea behind SJF**

SJF starts from a simple but powerful observation: if I need to serve multiple customers and want to minimize the total time everyone waits, I should serve first whoever needs the least time. Imagine being a cashier with three customers in line: one needs to pay for 20 items, one for 5 items, and one for just 1 item. If you serve the one with 20 items first, the other two will wait a very long time. But if you serve first the one with 1 item, then the one with 5, and finally the one with 20, the total waiting time will be minimum.

This principle, translated to process scheduling, tells us to always execute the process with the shortest burst time among those ready in the Ready Queue.

**Why SJF is mathematically optimal**

SJF is not just a reasonable heuristic: it is provably the optimal algorithm for minimizing average waiting time. The proof is intuitive: every time we move a short process before a long one, we reduce total waiting because the short process "blocks" others for less time.

This property makes SJF the theoretical benchmark against which to compare all other algorithms: no non-preemptive algorithm can do better in terms of average waiting time.

**The problem of knowing the future**

There's a fundamental problem with SJF: how do we know how long a process will take before it starts? In a real system, burst time is not known in advance. It's as if the cashier had to guess how many items each customer has in their cart without being able to see!

For this reason, real systems use prediction techniques. The most common is weighted exponential averaging: the next burst time is estimated as a combination of the actual previous burst and the previous estimate. With this formula, the system "learns" from each process's past behavior.

**The risk of starvation**

The dark side of SJF is starvation (literally "death by hunger"). If short processes continuously arrive, a long process might never get the CPU. In theory, it could wait forever!

This makes SJF unsuitable for systems where all processes must guarantee a bounded completion time. The typical solution is aging: gradually increasing a process's priority based on how long it has waited.

**When to use SJF**

SJF is ideal in batch environments where jobs have known or estimable burst times, and where the absolute priority is minimizing average waiting time. It's less suitable for interactive systems where responsiveness and fairness are priorities.`,
                keyPoints: [
                    'Complexity O(n²) with linear search, O(n log n) with optimized structures',
                    'Provably optimal: no other algorithm has lower AWT',
                    'Requires knowledge or accurate estimation of burst time',
                    'Risk of starvation for processes with long burst time',
                    'Intrinsic bias: systematically favors short processes',
                    'Theoretical benchmark for evaluating other scheduling algorithms'
                ],
                pros: [
                    'Minimum possible average waiting time among non-preemptive algorithms',
                    'Maximizes throughput: more processes completed per time unit',
                    'Short processes get rapid response',
                    'Excellent for batch systems with predictable workload',
                    'Theoretical foundation for more advanced algorithms',
                    'Excellent results when burst times are known or estimable'
                ],
                cons: [
                    'Starvation: long processes may wait indefinitely',
                    'Requires burst time prediction, rarely available',
                    'Computational overhead to find the minimum',
                    'Non-preemptive: a long process still blocks the CPU',
                    'Perceived as unfair by CPU-intensive processes',
                    'Difficult practical application without process information'
                ]
            },
            SRTF: {
                description: 'Shortest Remaining Time First (SRTF), also known as Preemptive SJF, takes the concept of SJF to its logical extreme: not only do we choose the shortest process, but we are willing to interrupt any running process if an even shorter one arrives.',
                theory: `**SRTF: the preemptive evolution of SJF**

SRTF represents the "aggressive" version of SJF. While SJF waits for a process to finish before choosing another, SRTF is ready to interrupt the current process at any moment if a new process with less remaining time arrives.

The idea is simple: if you're serving a customer who needs another 10 minutes, and a customer who needs only 1 minute arrives, you stop serving the first one (putting them temporarily on hold) and immediately serve the second. This way, the second customer doesn't have to wait 10 minutes for a 1-minute matter.

**The concept of "remaining time"**

The fundamental difference between SJF and SRTF lies in what is being compared. SJF compares the total burst time of processes, while SRTF compares remaining time: how much time remains until each process completes.

For example: a process with burst time of 10 units that has already executed for 8 units has a remaining time of only 2 units. If a new process arrives with burst time of 3 units, the current process is NOT interrupted (2 < 3). But if the new process had burst time of 1 unit, then YES, preemption would occur.

**The absolutely optimal algorithm**

SRTF is the provably optimal algorithm in absolute terms for minimizing average waiting time. This means that, among all possible scheduling algorithms (preemptive and non-preemptive), none can do better than SRTF in terms of average waiting time.

This is an extremely important theoretical property: SRTF represents the theoretical performance limit. Any other algorithm can only hope to approach its performance, never surpass it.

**The cost of perfection: context switching**

Perfection has a price. Every time SRTF interrupts a process to execute another, it must perform a context switch: save the complete state of the current process (CPU registers, program counter, stack, memory state) and load that of the new process.

This takes time (typically 1-10 microseconds on modern processors) and pollutes caches, slowing subsequent execution. In scenarios with many frequent arrivals of short processes, context switch overhead can become significant.

**Amplified starvation**

If SJF has a starvation problem, SRTF amplifies it. In SJF, at least once a long process starts executing, it can complete undisturbed. In SRTF, a long process can be continuously interrupted by short processes arriving, potentially making zero progress for long periods.

This makes SRTF even more problematic in scenarios where completion guarantees are important.

**Practical applications**

Despite its ideal theoretical properties, SRTF is rarely used in its pure form in real systems. Starvation problems, context switch overhead, and the need to know remaining time make it impractical. However, many modern schedulers take inspiration from its principles to optimize performance.`,
                keyPoints: [
                    'Provably optimal algorithm: impossible to do better for AWT',
                    'Preemption based on remaining time, not total burst time',
                    'Requires continuous knowledge of each process remaining time',
                    'Potentially very high context switch overhead',
                    'Even more severe starvation than SJF',
                    'Theoretical standard for evaluating any other algorithm'
                ],
                pros: [
                    'Absolute minimum average waiting time among all algorithms',
                    'Immediate response for short processes, even if they arrive late',
                    'Theoretically maximum throughput',
                    'Short processes never wait for long ones',
                    'Perfect theoretical benchmark for comparisons',
                    'Maximum responsiveness for dynamic workloads'
                ],
                cons: [
                    'Context switch overhead can negate theoretical advantages',
                    'Extreme starvation for long processes',
                    'Requires continuous remaining time tracking (unrealistic)',
                    'Significant implementation complexity',
                    'Long processes may make zero progress for long periods',
                    'Rarely used in practice in its pure form'
                ]
            },
            RR: {
                description: 'Round Robin (RR) represents a completely different philosophy compared to SJF and SRTF. Instead of trying to optimize performance, RR focuses on fairness: every process receives the same portion of CPU time, regardless of its duration or importance.',
                theory: `**The idea of fair time-sharing**

Round Robin comes from a simple and democratic concept: all processes deserve equal attention. Imagine a round table where each participant can speak for exactly 2 minutes, then must yield the floor to the next person. It doesn't matter if someone has a lot to say or very little: everyone gets the same time.

In the scheduling context, each process receives a "quantum" of time (typically 10-100 milliseconds) during which it can use the CPU. When the quantum expires, the process is interrupted (preemption) and moved to the back of the queue, while the next process in queue gets its turn.

**Choosing the quantum: a crucial trade-off**

The quantum size is probably the most important decision in Round Robin configuration, because it profoundly influences system performance.

If the quantum is too large, Round Robin behaves essentially like FCFS. Imagine a quantum of 1 hour: practically every process would finish before the quantum expires, so there would never be preemption.

If the quantum is too small, the system will spend more time switching contexts than actually executing processes. A quantum of 1 microsecond would mean doing millions of context switches per second!

The rule of thumb suggests choosing a quantum such that about 80% of process bursts are shorter than the quantum. In modern systems, typical values range from 10 to 100 milliseconds.

**Guaranteed response time**

One of the most important properties of Round Robin is the response time guarantee. If there are n processes in the system and the quantum is Q, the maximum time a process must wait before getting its next turn is (n-1) × Q.

This predictability is fundamental for interactive systems: a user pressing a key wants to see a response within reasonable time, not after a heavy process has monopolized the CPU for minutes.

**Why RR eliminates starvation**

One of Round Robin's greatest virtues is the impossibility of starvation. Every process, regardless of its characteristics, regularly gets its CPU turn. There are no "second-class citizens" in Round Robin.

This contrasts sharply with SJF and SRTF, where a long process could theoretically never be executed.

**RR's limitations**

The price of fairness is inefficiency. Round Robin completely ignores process characteristics: a process needing 1 millisecond is treated exactly like one needing 1 hour. This can lead to significantly higher average waiting times compared to SJF.

Additionally, context switch overhead is proportional to the number of processes divided by the quantum. With many processes and a small quantum, the overhead can become significant.

**Round Robin in modern systems**

Despite its limitations, Round Robin remains at the base of many modern schedulers. Linux's Completely Fair Scheduler (CFS), for example, is essentially a sophisticated version of Round Robin that tracks how much CPU time each process has received and dynamically balances allocation.`,
                keyPoints: [
                    'O(1) complexity per decision: just take the next one from the queue',
                    'Typical quantum: 10-100ms, crucial for performance',
                    'Guarantees that every process advances regularly',
                    'Maximum predictable response time: (n-1) × quantum',
                    'Deterministic context switch: happens every quantum',
                    'Foundation of modern schedulers like Linux CFS'
                ],
                pros: [
                    'Absolute fairness: every process receives the same attention',
                    'Starvation impossible: all processes progress',
                    'Guaranteed and predictable response time',
                    'Ideal for multi-user interactive systems',
                    'Simple implementation with a circular queue',
                    'Scales well with increasing number of processes'
                ],
                cons: [
                    'Context switch overhead can be high',
                    'Average waiting time worse than SJF',
                    'Performance heavily depends on quantum choice',
                    'Does not consider priority or process duration',
                    'Short processes might wait too long with small quantum',
                    'Inefficient when processes have very different needs'
                ]
            },
            PRIORITY: {
                description: 'Priority Scheduling introduces a fundamental concept that other algorithms ignore: not all processes are equal. Some are more important than others and deserve to be executed first, regardless of their arrival order or duration.',
                theory: `**The concept of priority in scheduling**

Priority Scheduling starts from a very practical observation: in the real world, some things are more urgent than others. In a hospital, a patient with a heart attack is treated before someone with a cold, regardless of who arrived first or how long treatment will take.

Similarly, in the operating system some processes are more critical than others. A process handling keyboard input must respond immediately, while a backup process can wait. Priority Scheduling allows encoding these differences by assigning a numerical priority value to each process.

**High or low priority: conventions vary**

A point that confuses many students: in some systems, higher numbers mean higher priority; in others, lower numbers mean higher priority. In our simulator, we use the second convention: priority 1 is highest, priority 10 is lower.

This convention comes from Unix, where the "nice" command allows processes to be "nice" to others by giving them more priority. A high nice value means "I'm nice, I let others go before me".

**Static vs dynamic priority**

Priority can be assigned in two fundamentally different ways:

Static priority is assigned when the process is created and never changes. It's simple to implement but risks being too rigid.

Dynamic priority changes over time based on various factors. The most common technique is aging: a process's priority gradually increases based on how long it has waited. This solves the starvation problem, because even a low-priority process will eventually become "old" enough to get the CPU.

**The priority inversion problem**

Priority inversion is one of the most insidious bugs in scheduling. It occurs when a high-priority process must wait for a low-priority process. How can this happen?

Imagine three processes: A (high priority), M (medium), B (low). B acquires a lock on a shared resource, then is interrupted by M which has higher priority. A arrives and wants the lock held by B, but cannot proceed. M continues executing preventing B from releasing the lock, and A (which has the highest priority!) waits for both M and B!

This bug caused the Mars Pathfinder to reset in 1997 while on Mars. It was fixed with the Priority Inheritance Protocol: when A waits for B, B temporarily "inherits" A's priority.

**Multi-level schedulers**

In real operating systems, Priority Scheduling is often combined with other algorithms in multi-level architectures. For example, Linux uses the Completely Fair Scheduler for normal processes but maintains a separate high-priority queue for real-time processes using FIFO or Round Robin.

**Applications in real-time systems**

Priority Scheduling is essential in real-time systems where some tasks have absolute deadlines. Algorithms like Rate Monotonic Scheduling (RMS) automatically assign higher priorities to tasks with shorter periods, mathematically guaranteeing that all deadlines are met if total CPU load doesn't exceed a certain threshold.`,
                keyPoints: [
                    'O(n) complexity with linear search, O(log n) with heap structures',
                    'Priority can be static (immutable) or dynamic (changes over time)',
                    'Without aging, low-priority processes risk indefinite starvation',
                    'Priority inversion is a real risk (Mars Pathfinder case)',
                    'Fundamental for real-time systems with strict deadlines',
                    'Foundation for modern multi-level scheduling architectures'
                ],
                pros: [
                    'Total control over process execution order',
                    'Critical processes are always executed first',
                    'Perfectly adaptable to real-time requirements',
                    'Flexible: dynamic priority solves many problems',
                    'Allows differentiated service classes (batch, interactive, real-time)',
                    'Combinable with other algorithms in hybrid architectures'
                ],
                cons: [
                    'Starvation for low-priority processes without countermeasures',
                    'Priority inversion requires complex protocols (PIP, PCP)',
                    'Difficult to determine optimal priorities beforehand',
                    'Computational overhead for aging management',
                    'Can be perceived as unfair by users',
                    'Correct configuration requires in-depth workload analysis'
                ]
            },
            HRRN: {
                description: 'Highest Response Ratio Next (HRRN) balances fairness and efficiency by calculating a response ratio for each process, favoring those that have waited longer relative to their burst time.',
                theory: `**The Response Ratio: The Math of Fairness**

HRRN is designed to correct SJF's (Shortest Job First) fatal flaw: starvation. To do this, it introduces the concept of "Response Ratio" (R), a dynamic value recalculated at every scheduling decision.

The formula is: **R = (W + S) / S**

where:
• **W** (Waiting Time) = Time spent by the process waiting in the ready queue
• **S** (Service Time) = Estimated burst time of the process

**How Implicit Aging Works**

Analyzing the formula, we notice two interesting behaviors:
1. If the denominator S is small (short process), R tends to be large. This preserves the preference for short jobs typical of SJF.
2. If the numerator W grows (process waits), R grows linearly.

This second point is crucial: even a very long process, if it waits long enough, will have a W value so high that its ratio R will exceed that of new incoming short processes. It is an automatic and mathematically guaranteed "aging" mechanism.

**Numeric Example**

Imagine a process P1 (burst 10) that has been waiting for 50 time units.
R(P1) = (50 + 10) / 10 = 6.

Now P2 (burst 1) arrives. Being newly arrived, W=0.
R(P2) = (0 + 1) / 1 = 1.

Even though P2 is tiny, P1 has accumulated enough "preemption right" to be executed first. This demonstrates how the algorithm dynamically balances the "CPU hunger" of old processes with the efficiency of serving short ones.

**Computational Cost**

The price to pay is complexity. In FCFS, nothing is calculated. In SJF, we look for the minimum. In HRRN, every time the CPU becomes free, we must update W for *all* waiting processes and recalculate R. On systems with thousands of processes, this overhead can become non-negligible.`,
                keyPoints: [
                    'Response Ratio = (Waiting Time + Burst Time) / Burst Time',
                    'Eliminates starvation: response ratio increases with waiting',
                    'Non-preemptive: once started, process runs to completion',
                    'Automatically balances efficiency and fairness',
                    'No configuration parameters like aging required',
                    'O(n²) complexity to calculate all ratios'
                ],
                pros: [
                    'Completely eliminates starvation',
                    'Maintains good performance like SJF',
                    'Automatic balance between short and long processes',
                    'No explicit aging configuration required',
                    'Still favors short processes',
                    'Perceived as fairer by users'
                ],
                cons: [
                    'Computational overhead: must calculate ratio for each process',
                    'Requires burst time knowledge',
                    'Non-preemptive: long processes block CPU',
                    'More complex to implement than FCFS',
                    'Lower performance than pure SJF in no-starvation scenarios',
                    'Not suitable for real-time systems'
                ]
            },
            PRIORITY_P: {
                description: 'Preemptive Priority Scheduling is the preemptive version of priority scheduling. When a higher priority process arrives, the current process is immediately interrupted.',
                theory: `**Priority-Based Preemption**

Unlike the non-preemptive version, Preemptive Priority is an "aggressive" algorithm. The scheduler does not wait for a process to finish or voluntarily block for I/O. At every single instant a new process arrives in the Ready Queue, the scheduler compares the newcomer's priority with that of the currently running process.

If (New_Priority < Current_Priority), an immediate context switch occurs. Remember that in our system, lower number = higher priority.

**The Essence of Real-Time Systems**

This behavior is not just an optimization: it is an absolute necessity for Real-Time Operating Systems (RTOS). Think of a car's ABS: when sensors detect wheel locking, the brake control process must be executed **immediately**, interrupting anything else (like the radio display update).

In a non-preemptive system, the ABS process would have to wait for the radio to finish updating the screen. In a car moving at 100 km/h, those milliseconds of delay could be fatal. Preemptive Priority guarantees that the critical task gets the CPU the very instant it becomes ready.

**The Priority Inversion Problem**

The preemptive version suffers acutely from a problem known as Priority Inversion.
Scenario:
• Task L (Low priority) acquires a lock on a shared resource.
• Task H (High priority) arrives, preempts L, and tries to acquire the same lock.
• H blocks because the lock is busy.
• Task M (Medium priority) arrives. It has priority > L, so it preempts L.
• Result: M runs, L cannot release the lock, and H (the most important!) waits for M.

Unnoticed, a medium-importance task is blocking a critical task. This scenario requires advanced protocols like **Priority Inheritance** (L temporarily inherits H's priority) to be resolved.`,
                keyPoints: [
                    'Immediate preemption for higher priority processes',
                    'Ideal for real-time systems with strict deadlines',
                    'Priority inversion requires explicit handling',
                    'Frequent context switches can increase overhead',
                    'Starvation possible for low-priority processes',
                    'Used in modern operating system kernels'
                ],
                pros: [
                    'Immediate response for critical processes',
                    'Ideal for real-time systems',
                    'Guarantees urgent tasks do not wait',
                    'Flexible with dynamic priorities',
                    'Enables guaranteed deadlines',
                    'Standard for interrupt handling'
                ],
                cons: [
                    'Severe starvation for low priorities',
                    'High context switch overhead',
                    'Priority inversion more problematic',
                    'Requires complex protocols (PIP, PCP)',
                    'Difficult to determine optimal priorities',
                    'Low-priority long processes may never complete'
                ]
            },
            LJF: {
                description: 'Longest Job First (LJF) is the opposite of SJF: it always selects the process with the longest burst time. While counterintuitive, it is useful for comparative studies.',
                theory: `**The Logic of the "Worst Case"**

Longest Job First (LJF) is a counterintuitive algorithm: why would we ever want to run the longest processes first? It seems like a recipe for disaster. And indeed, in almost all modern interactive systems, it is. But its study is fundamental because it represents the theoretical "stress test" par excellence.

**Throughput Analysis**

While SJF maximizes the number of jobs completed per unit of time, LJF does the exact opposite.
Imagine a long job (1000s) and 10 short jobs (1s each).
• SJF completes the 10 short jobs in 10s. Immediate utility for 10 users.
• LJF forces 10 users to wait 1000s + execution.
System throughput collapses dramatically in the initial phases.

**Utility in Hybrid and Batch Systems**

However, niche scenarios exist where LJF makes sense. Consider a graphic rendering system where short jobs are previews and long jobs are final 8K renders.
If the system used SJF, 8K renders would be continuously postponed (starvation) by constant user preview requests. Using LJF (or mechanisms inspired by it) guarantees that "heavyweights" are processed, while previews can wait slightly longer.

Also, if the system must handle I/O vs CPU bound saturated resources, sometimes giving priority to long jobs (often CPU bound) allows keeping the CPU busy while short jobs (often I/O bound) wait briefly, improving global resource utilization in specific conditions.

**The Reverse Convoy**

In FCFS, a long process blocks others randomly. In LJF, blocking is systematic and guaranteed. It is the perfect academic demonstration of how a scheduling policy can destroy system responsiveness if not aligned with user goals.`,
                keyPoints: [
                    'Selects process with longest burst time',
                    'Opposite of SJF: maximizes average waiting time',
                    'Useful for comparative studies and benchmarking',
                    'Non-preemptive: process completes before yielding',
                    'Short processes suffer very high waiting times',
                    'Rarely used in practice'
                ],
                pros: [
                    'Long jobs have guaranteed priority',
                    'Useful for benchmark and theoretical comparisons',
                    'Simple implementation',
                    'Predictable: execution order is known',
                    'No starvation risk for long jobs',
                    'Can be useful in specific batch systems'
                ],
                cons: [
                    'Maximum average waiting time',
                    'Short processes wait enormously',
                    'Poor throughput',
                    'Totally unsuitable for interactive systems',
                    'Requires burst time knowledge',
                    'Generates maximum dissatisfaction for short processes'
                ]
            },
            LRTF: {
                description: 'Longest Remaining Time First (LRTF) is the preemptive version of LJF. It always selects the process with the longest remaining time, preempting if necessary.',
                theory: `**The Anti-Optimization**

If SRTF is the mathematically optimal algorithm for *minimizing* average waiting time, LRTF (Longest Remaining Time First) is the algorithm that tends to *maximize* it. It is the "dark mirror" of SRTF. Studying it helps us understand the lower bounds of system performance.

**Dynamic Behavior and Thrashing**

LRTF has a unique pathological behavior: it tends to make all processes finish almost simultaneously.
Imagine two processes, A (100s) and B (90s).
1. LRTF runs A until its remaining time drops below 90s (so for 10s).
2. Now A=90s, B=90s.
3. LRTF will start alternating them continuously (or at every microscopic quantum), keeping them even.
4. If C (50s) arrives, it will have to wait for A and B to both drop to 50s.

The result? Instead of getting B out of the system quickly, LRTF holds it until the end. "Multiprogramming" is maximized, but average "Turnaround Time" explodes.

**Maximizing Parallelism (Theoretical)**

A subtle theoretical advantage exists: LRTF tends to keep the maximum possible number of processes active for the longest possible time. In complex parallel systems where processes undergo I/O phases, keeping them all "alive" but slow might (in rare and specific cases) increase the chances of finding useful work to do when a process blocks. However, on a single-core CPU, it is almost always the worst choice.`,
                keyPoints: [
                    'Preemptive version of LJF',
                    'Selects process with longest remaining time',
                    'Intentionally maximizes average waiting time',
                    'Short processes suffer enormously',
                    'Many context switches possible',
                    'Primarily an academic tool'
                ],
                pros: [
                    'Long jobs always have the CPU',
                    'Useful for comparisons with SRTF',
                    'Effective teaching tool',
                    'Shows the extreme opposite of optimization',
                    'Preemptive: can respond to new arrivals',
                    'Benchmark for worst-case performance'
                ],
                cons: [
                    'Maximum possible average waiting time',
                    'Short processes may wait indefinitely',
                    'High context switch overhead',
                    'Totally impractical in production',
                    'Guaranteed starvation for short processes',
                    'Worst performance in all real scenarios'
                ]
            }
        }
    }
};

type TabType = 'theory' | 'example' | 'proscons';

export const AlgoHelpModal: React.FC<AlgoHelpModalProps> = ({ algorithm, onClose }) => {
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('theory');
    const [animationTime, setAnimationTime] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const modalT = MODAL_TRANSLATIONS[language as keyof typeof MODAL_TRANSLATIONS];
    const algoMeta = ALGO_DATA[algorithm];
    const algoDetails = modalT.algoDetails[algorithm as keyof typeof modalT.algoDetails];
    const algoName = t.algoNames[algorithm];

    // Animation logic
    const totalTime = algoMeta.example.totalTime;

    const stepAnimation = useCallback(() => {
        setAnimationTime(prev => {
            if (prev >= totalTime) {
                setIsAnimating(false);
                return prev;
            }
            return prev + 1;
        });
    }, [totalTime]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isAnimating && animationTime < totalTime) {
            interval = setInterval(stepAnimation, 600);
        }
        return () => clearInterval(interval);
    }, [isAnimating, animationTime, totalTime, stepAnimation]);

    const handlePlayPause = () => {
        if (animationTime >= totalTime) {
            setAnimationTime(0);
            setIsAnimating(true);
        } else {
            setIsAnimating(!isAnimating);
        }
    };

    const handleReset = () => {
        setIsAnimating(false);
        setAnimationTime(0);
    };

    const tabClass = (tab: TabType) =>
        `px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`;

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className={`bg-gradient-to-r ${algoMeta.color} px-5 py-4 flex items-center justify-between flex-shrink-0`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{algoMeta.icon}</span>
                        <div>
                            <h3 className="text-white font-bold text-base">{algoName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {algoMeta.complexity}
                                </span>
                                <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {algoMeta.type === 'preemptive' ? modalT.preemptive : modalT.nonPreemptive}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-2 flex gap-2 flex-shrink-0">
                    <button className={tabClass('theory')} onClick={() => setActiveTab('theory')}>
                        <BookOpen size={14} className="inline mr-1.5 -mt-0.5" />
                        {modalT.tabs.theory}
                    </button>
                    <button className={tabClass('example')} onClick={() => setActiveTab('example')}>
                        <Play size={14} className="inline mr-1.5 -mt-0.5" />
                        {modalT.tabs.example}
                    </button>
                    <button className={tabClass('proscons')} onClick={() => setActiveTab('proscons')}>
                        <Target size={14} className="inline mr-1.5 -mt-0.5" />
                        {modalT.tabs.proscons}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-5">
                    {/* Theory Tab */}
                    {activeTab === 'theory' && (
                        <div className="space-y-4 animate-fade-in-up">
                            {/* Description */}
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {algoDetails.description}
                            </p>

                            {/* Expanded Theory Section */}
                            {'theory' in algoDetails && (
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-indigo-200 dark:border-slate-700">
                                    <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-3 flex items-center gap-2">
                                        <BookOpen size={16} />
                                        Approfondimento Teorico
                                    </h4>
                                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                                        {(algoDetails as any).theory.split('**').map((part: string, i: number) =>
                                            i % 2 === 1
                                                ? <strong key={i} className="text-indigo-600 dark:text-indigo-400 font-bold">{part}</strong>
                                                : <span key={i}>{part}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Key Points */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3 flex items-center gap-2">
                                    <Zap size={16} className="text-amber-500" />
                                    {modalT.keyPoints}
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {algoDetails.keyPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                            <ChevronRight size={12} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Example Tab */}
                    {activeTab === 'example' && (
                        <div className="space-y-5 animate-fade-in-up">
                            {/* Process Table */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3">
                                    {modalT.example}
                                    {algorithm === 'RR' && <span className="ml-2 text-xs font-normal text-slate-400">({modalT.quantum})</span>}
                                </h4>
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-slate-500 dark:text-slate-400">
                                            <th className="text-left py-1">{modalT.process}</th>
                                            <th className="text-center py-1">{modalT.arrival}</th>
                                            <th className="text-center py-1">{modalT.burst}</th>
                                            {algorithm === 'PRIORITY' && <th className="text-center py-1">{modalT.priority}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {algoMeta.example.processes.map(p => (
                                            <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="py-2 flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded" style={{ backgroundColor: p.color }}></span>
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{p.id}</span>
                                                </td>
                                                <td className="text-center text-slate-600 dark:text-slate-400">{p.arrival}</td>
                                                <td className="text-center text-slate-600 dark:text-slate-400">{p.burst}</td>
                                                {algorithm === 'PRIORITY' && 'priority' in p && (
                                                    <td className="text-center text-slate-600 dark:text-slate-400">{p.priority}</td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Animated Gantt Chart */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-indigo-200 dark:border-slate-700">
                                {/* Controls */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePlayPause}
                                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                                        >
                                            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock size={14} className="text-indigo-500" />
                                        <span className="text-slate-600 dark:text-slate-400">{modalT.currentTime}:</span>
                                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded">
                                            {animationTime}
                                        </span>
                                    </div>
                                </div>

                                {/* Gantt Chart */}
                                <div className="relative h-12 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                                    {/* Time marker */}
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 transition-all duration-500 ease-linear"
                                        style={{ left: `${(animationTime / totalTime) * 100}%` }}
                                    >
                                        <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                                    </div>

                                    {/* Gantt blocks */}
                                    {algoMeta.example.gantt.map((block, i) => {
                                        const process = algoMeta.example.processes.find(p => p.id === block.id);
                                        const left = (block.start / totalTime) * 100;
                                        const width = ((block.end - block.start) / totalTime) * 100;
                                        const isActive = animationTime >= block.start && animationTime < block.end;
                                        const isCompleted = animationTime >= block.end;

                                        return (
                                            <div
                                                key={i}
                                                className={`absolute top-1 bottom-1 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all duration-300 ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-700 scale-105 z-10' : ''} ${isCompleted ? 'opacity-80' : animationTime < block.start ? 'opacity-40' : ''}`}
                                                style={{
                                                    backgroundColor: process?.color || '#888',
                                                    left: `${left}%`,
                                                    width: `${width}%`,
                                                }}
                                            >
                                                {block.id}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Time axis */}
                                <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
                                    {Array.from({ length: totalTime + 1 }, (_, i) => (
                                        <span key={i} className={i === animationTime ? 'text-indigo-500 font-bold' : ''}>
                                            {i}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pros & Cons Tab */}
                    {activeTab === 'proscons' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                            {/* Pros */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
                                <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    {modalT.pros}
                                </h4>
                                <ul className="space-y-2">
                                    {algoDetails.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cons */}
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800/50">
                                <h4 className="font-bold text-red-700 dark:text-red-400 text-sm mb-3 flex items-center gap-2">
                                    <XCircle size={16} />
                                    {modalT.cons}
                                </h4>
                                <ul className="space-y-2">
                                    {algoDetails.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className={`bg-gradient-to-r ${algoMeta.color} hover:opacity-90 text-white py-2 px-5 rounded-lg font-medium text-sm transition-all shadow-lg`}
                    >
                        {modalT.close}
                    </button>
                </div>
            </div>
        </div>
    );
};
