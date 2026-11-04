import type { Equipment, Exercise, Lang, Localized, Muscle } from './types';

interface BuiltIn {
  id: string;
  muscle: Muscle;
  equipment: Equipment;
  name: Localized;
  howto: Localized;
}

/** Numbered steps followed by a single coaching tip. */
type Guide = [steps: string[], tip: string];

function format([steps, tip]: Guide, tipLabel: string): string {
  return `${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${tipLabel}: ${tip}`;
}

function ex(
  id: string,
  muscle: Muscle,
  equipment: Equipment,
  nameEn: string,
  nameRo: string,
  en: Guide,
  ro: Guide,
): BuiltIn {
  return {
    id,
    muscle,
    equipment,
    name: { en: nameEn, ro: nameRo },
    howto: { en: format(en, 'Tip'), ro: format(ro, 'Sfat') },
  };
}

const BUILT_IN: BuiltIn[] = [
  // Chest
  ex('bench_press', 'chest', 'barbell', 'Barbell Bench Press', 'Împins cu bara la bancă',
    [[
      'Lie on a flat bench with your eyes under the bar. Plant both feet firmly on the floor, pull your shoulder blades together and down, and keep a slight arch in your lower back.',
      'Grip the bar slightly wider than shoulder width, wrap your thumbs around it, and unrack it with straight arms over your shoulders.',
      'Inhale and lower the bar slowly to your mid-chest, keeping your elbows about 45° from your torso (not flared out at 90°).',
      'Touch your chest lightly without bouncing, then press the bar up and slightly back until your arms are fully straight. Exhale as you press.',
    ], 'Keep your head, shoulders and glutes on the bench the whole time. Use a spotter or safety arms when lifting heavy.'],
    [[
      'Întinde-te pe o bancă orizontală, cu ochii sub bară. Pune tălpile ferm pe podea, adu omoplații împreună și în jos și păstrează o mică arcuire în zona lombară.',
      'Prinde bara puțin mai larg decât lățimea umerilor, cu degetul mare în jurul ei, și scoate-o din suport cu brațele întinse deasupra umerilor.',
      'Inspiră și coboară bara încet spre mijlocul pieptului, ținând coatele la aproximativ 45° față de trunchi (nu desfăcute la 90°).',
      'Atinge ușor pieptul fără să ricoșezi, apoi împinge bara în sus și puțin spre spate până când brațele sunt complet întinse. Expiră în timp ce împingi.',
    ], 'Ține capul, umerii și fesele pe bancă tot timpul. Folosește un partener de siguranță sau opritoarele când lucrezi cu greutăți mari.']),
  ex('incline_bench_press', 'chest', 'barbell', 'Incline Barbell Press', 'Împins cu bara la bancă înclinată',
    [[
      'Set the bench to a 30–45° incline and lie back with your eyes under the bar. Feet flat on the floor, shoulder blades pulled together.',
      'Grip the bar slightly wider than your shoulders and unrack it over your upper chest.',
      'Lower the bar under control to the top of your chest (just below the collarbone), elbows about 45° from your body.',
      'Press the bar back up in a straight line until your arms are fully extended.',
    ], 'Don\'t set the bench too steep: above 45° the shoulders take over from the chest.'],
    [[
      'Setează banca la 30–45° și întinde-te cu ochii sub bară. Tălpile pe podea, omoplații uniți.',
      'Prinde bara puțin mai larg decât umerii și scoate-o din suport deasupra părții de sus a pieptului.',
      'Coboară bara controlat spre partea de sus a pieptului (puțin sub claviculă), cu coatele la aproximativ 45° față de corp.',
      'Împinge bara înapoi pe o linie dreaptă până când brațele sunt complet întinse.',
    ], 'Nu seta banca prea înclinată: peste 45° umerii preiau efortul de la piept.']),
  ex('db_bench_press', 'chest', 'dumbbell', 'Dumbbell Bench Press', 'Împins cu gantere la bancă',
    [[
      'Sit on the end of a flat bench with a dumbbell on each thigh. Lie back, using your knees to help bring the weights up to chest level.',
      'Start with the dumbbells beside your mid-chest, palms facing forward, shoulder blades pulled together and feet flat on the floor.',
      'Press both dumbbells up until your arms are straight, bringing them slightly closer together at the top without clanking them.',
      'Lower slowly until your elbows are just below the bench level and you feel a stretch in your chest, then repeat.',
    ], 'Move both arms at the same speed. When finished, bring the weights back to your thighs before sitting up.'],
    [[
      'Stai pe marginea unei bănci orizontale cu câte o ganteră pe coapse. Întinde-te pe spate, ajutându-te de genunchi să aduci ganterele la nivelul pieptului.',
      'Începe cu ganterele lângă mijlocul pieptului, palmele spre înainte, omoplații uniți și tălpile pe podea.',
      'Împinge ambele gantere în sus până întinzi brațele, apropiindu-le ușor la final, fără să le lovești.',
      'Coboară încet până când coatele ajung puțin sub nivelul băncii și simți întinderea în piept, apoi repetă.',
    ], 'Mișcă ambele brațe cu aceeași viteză. La final, adu ganterele înapoi pe coapse înainte să te ridici.']),
  ex('incline_db_press', 'chest', 'dumbbell', 'Incline Dumbbell Press', 'Împins cu gantere la bancă înclinată',
    [[
      'Set the bench to 30–45°. Sit with the dumbbells on your thighs and lie back, bringing them to shoulder level.',
      'Keep your shoulder blades pulled together and your feet flat on the floor, palms facing forward.',
      'Press the dumbbells up and slightly together until your arms are straight above your upper chest.',
      'Lower slowly to a deep stretch at the sides of your chest, then press up again.',
    ], 'Choose a lighter weight than on the flat bench; control matters more than load here.'],
    [[
      'Setează banca la 30–45°. Așază-te cu ganterele pe coapse și întinde-te, aducându-le la nivelul umerilor.',
      'Ține omoplații uniți și tălpile pe podea, cu palmele spre înainte.',
      'Împinge ganterele în sus și ușor spre centru până întinzi brațele deasupra părții de sus a pieptului.',
      'Coboară încet până simți o întindere profundă în lateralul pieptului, apoi împinge din nou.',
    ], 'Alege o greutate mai mică decât la banca orizontală; controlul contează mai mult decât încărcătura.']),
  ex('db_fly', 'chest', 'dumbbell', 'Dumbbell Fly', 'Fluturări cu gantere',
    [[
      'Lie on a flat bench holding dumbbells straight above your chest, palms facing each other.',
      'Soften your elbows into a slight, fixed bend and keep that angle for the whole set.',
      'Open your arms out to the sides in a wide arc, lowering the weights until you feel a stretch across your chest (about shoulder level).',
      'Squeeze your chest to bring the dumbbells back up along the same arc, as if hugging a big tree.',
    ], 'This is a stretch-and-squeeze exercise, not a press: use light weights and never bend and straighten your elbows during the rep.'],
    [[
      'Întinde-te pe o bancă orizontală ținând ganterele drept deasupra pieptului, cu palmele una spre cealaltă.',
      'Îndoaie ușor coatele și păstrează acest unghi fix pe tot parcursul seriei.',
      'Deschide brațele în lateral pe un arc larg, coborând ganterele până simți întinderea în piept (aproximativ la nivelul umerilor).',
      'Contractă pieptul pentru a readuce ganterele sus pe același arc, ca și cum ai îmbrățișa un copac mare.',
    ], 'Este un exercițiu de întindere și contracție, nu de împins: folosește greutăți mici și nu îndoi și întinde coatele în timpul repetării.']),
  ex('cable_crossover', 'chest', 'cable', 'Cable Crossover', 'Încrucișări la cabluri',
    [[
      'Set both pulleys to the top position and grab a handle in each hand. Step forward into a staggered stance with one foot in front.',
      'Lean your torso slightly forward and keep a slight bend in your elbows.',
      'Pull the handles down and across in a wide arc until your hands meet in front of your lower chest.',
      'Squeeze your chest for a second, then let your arms open back up slowly until you feel a stretch.',
    ], 'Keep your torso still: if you rock back and forth, the weight is too heavy.'],
    [[
      'Setează ambii scripeți în poziția de sus și prinde câte un mâner în fiecare mână. Fă un pas înainte, cu un picior în față.',
      'Înclină trunchiul ușor înainte și păstrează coatele ușor îndoite.',
      'Trage mânerele în jos și spre centru pe un arc larg, până când mâinile se întâlnesc în fața părții de jos a pieptului.',
      'Strânge pieptul o secundă, apoi lasă brațele să se deschidă încet până simți întinderea.',
    ], 'Ține trunchiul stabil: dacă te balansezi înainte și înapoi, greutatea este prea mare.']),
  ex('chest_press_machine', 'chest', 'machine', 'Chest Press Machine', 'Presă piept la aparat',
    [[
      'Adjust the seat so the handles are level with the middle of your chest. Sit with your back and head against the pad.',
      'Grip the handles with your wrists straight and your feet flat on the floor.',
      'Press forward until your arms are almost straight, without locking your elbows hard.',
      'Return slowly until you feel a light stretch in your chest, without letting the weight stack touch down between reps.',
    ], 'Keep your shoulders down and back, away from your ears, throughout the movement.'],
    [[
      'Reglează scaunul astfel încât mânerele să fie la înălțimea mijlocului pieptului. Stai cu spatele și capul sprijinite pe spătar.',
      'Prinde mânerele cu încheieturile drepte și tălpile pe podea.',
      'Împinge înainte până aproape întinzi brațele, fără să blochezi brusc coatele.',
      'Revino încet până simți o ușoară întindere în piept, fără să lași greutățile să se așeze între repetări.',
    ], 'Ține umerii în jos și înapoi, departe de urechi, pe toată durata mișcării.']),
  ex('pec_deck', 'chest', 'machine', 'Pec Deck Fly', 'Fluturări la aparat (pec deck)',
    [[
      'Adjust the seat so the handles or arm pads are at chest height. Sit with your back flat against the pad.',
      'Place your forearms on the pads (or grip the handles) with elbows bent about 90°.',
      'Bring your arms together in front of your chest in a smooth arc and squeeze hard for a moment.',
      'Open your arms back slowly until you feel a comfortable stretch, not letting your shoulders roll forward.',
    ], 'Keep your chest lifted and don\'t let the weights slam: the slow return is half the work.'],
    [[
      'Reglează scaunul astfel încât mânerele sau pernele pentru brațe să fie la înălțimea pieptului. Stai cu spatele lipit de spătar.',
      'Pune antebrațele pe perne (sau prinde mânerele), cu coatele îndoite la aproximativ 90°.',
      'Adu brațele împreună în fața pieptului pe un arc lin și strânge puternic un moment.',
      'Deschide brațele înapoi încet până simți o întindere confortabilă, fără să lași umerii să se rotunjească înainte.',
    ], 'Ține pieptul ridicat și nu lăsa greutățile să cadă: întoarcerea lentă este jumătate din efort.']),
  ex('push_up', 'chest', 'bodyweight', 'Push-up', 'Flotări',
    [[
      'Start in a high plank: hands on the floor slightly wider than your shoulders, arms straight, feet together or hip-width apart.',
      'Tighten your abs and glutes so your body forms one straight line from head to heels.',
      'Bend your elbows (about 45° from your body) and lower your chest until it is just above the floor.',
      'Push the floor away to return to the start, keeping your hips from sagging or rising.',
    ], 'Too hard? Do them with your knees on the floor or with your hands on a bench.'],
    [[
      'Pornește din poziția de plank cu brațele întinse: mâinile pe podea, puțin mai late decât umerii, picioarele lipite sau la lățimea șoldurilor.',
      'Încordează abdomenul și fesele astfel încât corpul să formeze o linie dreaptă de la cap la călcâie.',
      'Îndoaie coatele (la aproximativ 45° față de corp) și coboară pieptul până aproape de podea.',
      'Împinge podeaua pentru a reveni, fără să lași șoldurile să cadă sau să se ridice.',
    ], 'Prea greu? Fă-le cu genunchii pe podea sau cu mâinile pe o bancă.']),
  ex('dips', 'chest', 'bodyweight', 'Dips', 'Dips la paralele',
    [[
      'Grip the parallel bars and jump or step up so your arms are straight and your body is supported above the bars.',
      'Lean your torso slightly forward and cross or bend your legs behind you.',
      'Bend your elbows and lower your body until your upper arms are about parallel to the floor, or you feel a good stretch in your chest.',
      'Push through your palms to straighten your arms and return to the top.',
    ], 'Leaning forward targets the chest, staying upright targets the triceps. Stop if you feel pain in the front of your shoulders.'],
    [[
      'Prinde barele paralele și urcă-te astfel încât brațele să fie întinse și corpul susținut deasupra barelor.',
      'Înclină trunchiul ușor înainte și încrucișează sau îndoaie picioarele în spate.',
      'Îndoaie coatele și coboară corpul până când brațele sunt aproape paralele cu podeaua sau simți o bună întindere în piept.',
      'Împinge prin palme pentru a întinde brațele și a reveni sus.',
    ], 'Înclinarea înainte lucrează pieptul, iar poziția verticală lucrează tricepsul. Oprește-te dacă simți durere în fața umerilor.']),

  // Back
  ex('deadlift', 'back', 'barbell', 'Deadlift', 'Îndreptări',
    [[
      'Stand with your feet hip-width apart and the bar over the middle of your feet. Bend down and grip the bar just outside your legs.',
      'Bend your knees until your shins touch the bar, lift your chest and flatten your back. Pull the slack out of the bar so your arms are straight like ropes.',
      'Take a deep breath, brace your abs and push the floor away with your legs, keeping the bar close to your body as it slides up your shins and thighs.',
      'Stand tall at the top by squeezing your glutes (don\'t lean back), then lower by pushing your hips back first, then bending your knees once the bar passes them.',
    ], 'Never round your lower back. If your form breaks down, lower the weight.'],
    [[
      'Stai cu picioarele la lățimea șoldurilor și bara deasupra mijlocului tălpilor. Apleacă-te și prinde bara chiar în afara picioarelor.',
      'Îndoaie genunchii până când tibiile ating bara, ridică pieptul și îndreaptă spatele. Întinde bara ușor ca brațele să fie drepte ca niște frânghii.',
      'Inspiră adânc, încordează abdomenul și împinge podeaua cu picioarele, ținând bara aproape de corp în timp ce alunecă pe tibii și coapse.',
      'Ridică-te complet strângând fesele (fără să te arcuiești înapoi), apoi coboară împingând întâi șoldurile în spate și îndoind genunchii după ce bara trece de ei.',
    ], 'Nu rotunji niciodată zona lombară. Dacă tehnica se strică, redu greutatea.']),
  ex('barbell_row', 'back', 'barbell', 'Barbell Row', 'Ramat cu bara',
    [[
      'Stand with feet hip-width apart, bar over mid-foot. Hinge at the hips until your torso is about 45° to the floor, back flat, and grip the bar just outside your knees.',
      'Let the bar hang with straight arms, knees slightly bent, and brace your abs.',
      'Pull the bar toward your lower ribs by driving your elbows back, squeezing your shoulder blades together at the top.',
      'Lower the bar slowly until your arms are straight again, without changing the angle of your torso.',
    ], 'If you have to jerk your body to lift the weight, it\'s too heavy.'],
    [[
      'Stai cu picioarele la lățimea șoldurilor, bara deasupra mijlocului tălpilor. Apleacă-te din șold până trunchiul e la aproximativ 45° față de podea, cu spatele drept, și prinde bara puțin în afara genunchilor.',
      'Lasă bara să atârne cu brațele întinse, genunchii ușor îndoiți, și încordează abdomenul.',
      'Trage bara spre coastele inferioare împingând coatele înapoi și strângând omoplații la final.',
      'Coboară bara încet până când brațele sunt din nou întinse, fără să schimbi unghiul trunchiului.',
    ], 'Dacă trebuie să te smucești ca să ridici greutatea, este prea mare.']),
  ex('pull_up', 'back', 'bodyweight', 'Pull-up', 'Tracțiuni',
    [[
      'Grab the bar with an overhand grip (palms facing away), a bit wider than your shoulders. Hang with your arms fully straight.',
      'Pull your shoulder blades down and back first, then drive your elbows down toward your hips.',
      'Pull until your chin clears the bar, keeping your chest up and avoiding swinging or kicking.',
      'Lower slowly all the way down to a full hang before the next rep.',
    ], 'Can\'t do one yet? Use an assistance band or machine, or practice slow lowering from the top.'],
    [[
      'Prinde bara cu priza de sus (palmele spre exterior), puțin mai larg decât umerii. Atârnă cu brațele complet întinse.',
      'Trage mai întâi omoplații în jos și înapoi, apoi coboară coatele spre șolduri.',
      'Trage-te până când bărbia depășește bara, cu pieptul sus și fără balans sau lovituri de picioare.',
      'Coboară încet până la atârnare completă înainte de următoarea repetare.',
    ], 'Nu poți face încă una? Folosește o bandă elastică sau aparat de asistență, sau exersează coborârea lentă de sus.']),
  ex('chin_up', 'back', 'bodyweight', 'Chin-up', 'Tracțiuni cu priză supinată',
    [[
      'Grab the bar with an underhand grip (palms facing you), about shoulder-width apart. Hang with your arms fully straight.',
      'Brace your abs, pull your shoulder blades down, and start pulling your elbows toward your ribs.',
      'Pull until your chin is over the bar, keeping your body still and your chest toward the bar.',
      'Lower with control until your arms are fully straight again.',
    ], 'The underhand grip uses more biceps than a pull-up, so it is usually a little easier.'],
    [[
      'Prinde bara cu priza de jos (palmele spre tine), la aproximativ lățimea umerilor. Atârnă cu brațele complet întinse.',
      'Încordează abdomenul, trage omoplații în jos și începe să aduci coatele spre coaste.',
      'Trage-te până când bărbia trece peste bară, cu corpul stabil și pieptul spre bară.',
      'Coboară controlat până când brațele sunt din nou complet întinse.',
    ], 'Priza supinată implică mai mult bicepsul decât tracțiunile clasice, deci este de obicei puțin mai ușoară.']),
  ex('lat_pulldown', 'back', 'cable', 'Lat Pulldown', 'Tracțiuni la helcometru',
    [[
      'Adjust the thigh pad so your legs are locked in. Grab the bar with an overhand grip wider than your shoulders and sit upright.',
      'Lean back very slightly, lift your chest and pull your shoulder blades down.',
      'Pull the bar down to your upper chest by driving your elbows down and toward your sides.',
      'Squeeze your back for a second, then let the bar rise slowly until your arms are straight and your lats are stretched.',
    ], 'Don\'t pull the bar behind your neck, and avoid swinging your body to get the weight down.'],
    [[
      'Reglează perna pentru coapse astfel încât picioarele să fie blocate. Prinde bara cu priza de sus, mai larg decât umerii, și stai drept.',
      'Înclină-te foarte ușor pe spate, ridică pieptul și trage omoplații în jos.',
      'Trage bara spre partea de sus a pieptului coborând coatele spre lateralul corpului.',
      'Strânge spatele o secundă, apoi lasă bara să urce încet până când brațele sunt întinse și dorsalii întinși.',
    ], 'Nu trage bara în spatele gâtului și evită să te balansezi pentru a coborî greutatea.']),
  ex('seated_cable_row', 'back', 'cable', 'Seated Cable Row', 'Ramat la cabluri din șezut',
    [[
      'Sit at the machine with your feet on the platform and knees slightly bent. Grab the handle and sit up tall with your back straight.',
      'Start with your arms extended and your shoulders relaxed forward, keeping your chest up.',
      'Pull the handle toward your stomach by driving your elbows straight back, squeezing your shoulder blades together.',
      'Pause briefly, then extend your arms slowly until you feel a stretch in your back.',
    ], 'Keep your torso upright: leaning far back turns the row into a swing and takes the work away from your back.'],
    [[
      'Stai la aparat cu picioarele pe platformă și genunchii ușor îndoiți. Prinde mânerul și stai drept, cu spatele întins.',
      'Începe cu brațele întinse și umerii relaxați înainte, cu pieptul sus.',
      'Trage mânerul spre abdomen împingând coatele drept în spate și strângând omoplații.',
      'Fă o scurtă pauză, apoi întinde brațele încet până simți întinderea în spate.',
    ], 'Ține trunchiul vertical: dacă te apleci mult pe spate, mișcarea devine un balans și spatele muncește mai puțin.']),
  ex('db_row', 'back', 'dumbbell', 'One-Arm Dumbbell Row', 'Ramat cu ganteră la un braț',
    [[
      'Place your left hand and left knee on a flat bench, with your right foot on the floor. Keep your back flat and parallel to the floor.',
      'Hold a dumbbell in your right hand with your arm hanging straight down.',
      'Pull the dumbbell up toward your hip by driving your elbow back and up, keeping your elbow close to your body.',
      'Squeeze your shoulder blade at the top, then lower slowly until your arm is straight. Finish all reps, then switch sides.',
    ], 'Don\'t twist your torso to lift the weight; keep your shoulders square to the floor.'],
    [[
      'Pune mâna stângă și genunchiul stâng pe o bancă orizontală, cu piciorul drept pe podea. Ține spatele drept și paralel cu podeaua.',
      'Ține o ganteră în mâna dreaptă, cu brațul atârnând drept în jos.',
      'Trage ganterea spre șold, împingând cotul în spate și în sus, aproape de corp.',
      'Strânge omoplatul la final, apoi coboară încet până brațul e întins. Termină toate repetările, apoi schimbă partea.',
    ], 'Nu răsuci trunchiul pentru a ridica greutatea; ține umerii paraleli cu podeaua.']),
  ex('tbar_row', 'back', 'barbell', 'T-Bar Row', 'Ramat T-bar',
    [[
      'Straddle the bar with feet shoulder-width apart. Hinge forward at the hips until your torso is roughly 45° to the floor, back flat.',
      'Grip the handle (or the bar with a V-handle) with arms straight and knees slightly bent.',
      'Pull the weight toward your chest by driving your elbows back, squeezing your shoulder blades together.',
      'Lower slowly until your arms are straight again, keeping your torso angle the same.',
    ], 'Keep your neck neutral by looking at the floor a little in front of you.'],
    [[
      'Stai deasupra barei cu picioarele la lățimea umerilor. Apleacă-te din șold până trunchiul e la aproximativ 45° față de podea, cu spatele drept.',
      'Prinde mânerul (sau bara cu mâner în V) cu brațele întinse și genunchii ușor îndoiți.',
      'Trage greutatea spre piept, împingând coatele în spate și strângând omoplații.',
      'Coboară încet până brațele sunt din nou întinse, păstrând același unghi al trunchiului.',
    ], 'Ține gâtul neutru privind podeaua puțin în fața ta.']),
  ex('face_pull', 'back', 'cable', 'Face Pull', 'Face pull',
    [[
      'Set a cable pulley at about head height with a rope attachment. Grab the rope with both hands, thumbs toward you, and step back until your arms are straight.',
      'Stand with your feet shoulder-width apart, chest up and core tight.',
      'Pull the rope toward your face, splitting the ends apart as you go, with your elbows high and out to the sides.',
      'At the end, your hands should be beside your ears. Squeeze your rear shoulders, then return slowly.',
    ], 'Use a light weight and focus on the squeeze; this exercise builds shoulder health and posture.'],
    [[
      'Setează un scripete la înălțimea capului cu o coardă. Prinde coarda cu ambele mâini, degetele mari spre tine, și fă un pas înapoi până brațele sunt întinse.',
      'Stai cu picioarele la lățimea umerilor, pieptul sus și abdomenul încordat.',
      'Trage coarda spre față, desfăcând capetele pe parcurs, cu coatele sus și în lateral.',
      'La final, mâinile trebuie să fie lângă urechi. Strânge deltoizii posteriori, apoi revino încet.',
    ], 'Folosește o greutate mică și concentrează-te pe contracție; exercițiul îmbunătățește sănătatea umerilor și postura.']),
  ex('back_extension', 'back', 'bodyweight', 'Back Extension', 'Extensii pentru spate',
    [[
      'Position yourself on a hyperextension bench with your hips just over the edge of the pad and your ankles secured under the rollers.',
      'Cross your arms over your chest (or behind your head) and start with your body in a straight line.',
      'Lower your torso toward the floor by bending at the hips, keeping your back flat.',
      'Raise your torso using your lower back and glutes until your body forms a straight line again. Don\'t go beyond that.',
    ], 'Moving slowly and stopping at a straight line protects your lower back from over-arching.'],
    [[
      'Așază-te la banca de hiperextensii cu șoldurile chiar peste marginea pernei și gleznele fixate sub role.',
      'Încrucișează brațele pe piept (sau pune-le la ceafă) și începe cu corpul într-o linie dreaptă.',
      'Coboară trunchiul spre podea îndoindu-te din șold, cu spatele drept.',
      'Ridică trunchiul folosind zona lombară și fesele până când corpul formează din nou o linie dreaptă. Nu merge mai sus.',
    ], 'Mișcarea lentă și oprirea la linia dreaptă protejează zona lombară de arcuirea excesivă.']),

  // Shoulders
  ex('overhead_press', 'shoulders', 'barbell', 'Overhead Press', 'Împins deasupra capului',
    [[
      'Stand with feet shoulder-width apart. Hold the bar just outside your shoulders, resting on your upper chest, with your elbows slightly in front of the bar.',
      'Squeeze your glutes and brace your abs so your body is a solid pillar.',
      'Press the bar straight up, moving your head slightly back so the bar passes your face, then push your head forward under the bar.',
      'Lock out your arms with the bar over the middle of your feet, then lower it back to your shoulders with control.',
    ], 'Don\'t lean back to push the weight up; if you do, your lower back is taking the strain.'],
    [[
      'Stai cu picioarele la lățimea umerilor. Ține bara puțin în afara umerilor, sprijinită pe partea de sus a pieptului, cu coatele ușor în fața barei.',
      'Strânge fesele și încordează abdomenul pentru ca trupul să fie un stâlp solid.',
      'Împinge bara drept în sus, mișcând ușor capul înapoi ca bara să treacă de față, apoi împinge capul înainte sub bară.',
      'Blochează brațele cu bara deasupra mijlocului tălpilor, apoi coboar-o controlat la umeri.',
    ], 'Nu te arcui pe spate pentru a împinge greutatea; dacă o faci, zona lombară preia efortul.']),
  ex('db_shoulder_press', 'shoulders', 'dumbbell', 'Dumbbell Shoulder Press', 'Împins umeri cu gantere',
    [[
      'Sit on a bench with back support (or stand) and bring the dumbbells to shoulder height, palms facing forward and elbows below your wrists.',
      'Brace your abs and keep your back against the pad.',
      'Press the dumbbells straight up until your arms are almost fully straight, bringing them slightly closer together at the top.',
      'Lower slowly until the dumbbells are back at about ear level, then repeat.',
    ], 'Keep your ribs down and don\'t over-arch your lower back as you press.'],
    [[
      'Stai pe o bancă cu spătar (sau în picioare) și adu ganterele la înălțimea umerilor, cu palmele spre înainte și coatele sub încheieturi.',
      'Încordează abdomenul și ține spatele lipit de spătar.',
      'Împinge ganterele drept în sus până aproape întinzi brațele, apropiindu-le ușor la final.',
      'Coboară încet până ganterele revin aproximativ la nivelul urechilor, apoi repetă.',
    ], 'Ține coastele în jos și nu arcui excesiv zona lombară în timp ce împingi.']),
  ex('lateral_raise', 'shoulders', 'dumbbell', 'Lateral Raise', 'Ridicări laterale',
    [[
      'Stand with feet hip-width apart, holding a dumbbell in each hand at your sides, palms facing your body.',
      'Keep a slight bend in your elbows and lean forward a few degrees.',
      'Raise your arms out to the sides until they are about shoulder height, leading with your elbows rather than your hands.',
      'Pause for a moment, then lower slowly. Don\'t let the weights drop.',
    ], 'Use a light weight. If you shrug your shoulders or swing your body, it\'s too heavy.'],
    [[
      'Stai cu picioarele la lățimea șoldurilor, cu câte o ganteră în fiecare mână pe lângă corp, palmele spre corp.',
      'Păstrează coatele ușor îndoiți și înclină-te câteva grade înainte.',
      'Ridică brațele în lateral până la înălțimea umerilor, conducând cu coatele, nu cu mâinile.',
      'Fă o scurtă pauză, apoi coboară încet. Nu lăsa ganterele să cadă.',
    ], 'Folosește o greutate mică. Dacă ridici umerii sau te balansezi, este prea mare.']),
  ex('front_raise', 'shoulders', 'dumbbell', 'Front Raise', 'Ridicări frontale',
    [[
      'Stand tall with feet hip-width apart, holding dumbbells in front of your thighs with palms facing your body.',
      'Brace your abs and keep a slight bend in your elbows.',
      'Raise one or both dumbbells straight in front of you to shoulder height.',
      'Pause at the top, then lower slowly back to your thighs.',
    ], 'Don\'t lean back or swing; the front of your shoulders should do the work.'],
    [[
      'Stai drept cu picioarele la lățimea șoldurilor, ținând ganterele în fața coapselor, cu palmele spre corp.',
      'Încordează abdomenul și păstrează coatele ușor îndoiți.',
      'Ridică una sau ambele gantere drept în față până la înălțimea umerilor.',
      'Fă o pauză sus, apoi coboară încet spre coapse.',
    ], 'Nu te apleca pe spate și nu te balansa; partea din față a umerilor trebuie să facă munca.']),
  ex('rear_delt_fly', 'shoulders', 'dumbbell', 'Rear Delt Fly', 'Fluturări pentru deltoidul posterior',
    [[
      'Stand with feet hip-width apart and hinge forward at the hips until your torso is nearly parallel to the floor. Let the dumbbells hang beneath you, palms facing each other.',
      'Keep your back flat, neck neutral and a slight bend in your elbows.',
      'Raise your arms out to the sides in a wide arc until they are level with your torso, squeezing your shoulder blades together.',
      'Pause, then lower slowly back to the start.',
    ], 'Use light weights. Imagine moving your elbows, not your hands, to feel the rear shoulders working.'],
    [[
      'Stai cu picioarele la lățimea șoldurilor și apleacă-te din șold până trunchiul e aproape paralel cu podeaua. Lasă ganterele să atârne, palmele una spre cealaltă.',
      'Ține spatele drept, gâtul neutru și coatele ușor îndoiți.',
      'Ridică brațele în lateral pe un arc larg până ajung la nivelul trunchiului, strângând omoplații.',
      'Fă o pauză, apoi coboară încet în poziția de start.',
    ], 'Folosește greutăți mici. Gândește-te că mișți coatele, nu mâinile, ca să simți deltoizii posteriori.']),
  ex('arnold_press', 'shoulders', 'dumbbell', 'Arnold Press', 'Arnold press',
    [[
      'Sit on a bench with back support, holding dumbbells in front of your shoulders with your palms facing you and elbows pointing forward.',
      'Start pressing the dumbbells up while rotating your wrists so your palms turn to face forward.',
      'Finish with your arms almost straight overhead and palms facing forward.',
      'Lower slowly, rotating your palms back toward you, until the dumbbells are back in front of your shoulders.',
    ], 'The rotation should be smooth and continuous. Use a lighter weight than for a standard shoulder press.'],
    [[
      'Stai pe o bancă cu spătar, ținând ganterele în fața umerilor, cu palmele spre tine și coatele îndreptate înainte.',
      'Începe să împingi ganterele în sus rotind încheieturile, astfel încât palmele să se întoarcă spre înainte.',
      'Termină cu brațele aproape întinse deasupra capului și palmele spre înainte.',
      'Coboară încet, rotind palmele înapoi spre tine, până ganterele revin în fața umerilor.',
    ], 'Rotația trebuie să fie lină și continuă. Folosește o greutate mai mică decât la împinsul clasic.']),
  ex('upright_row', 'shoulders', 'barbell', 'Upright Row', 'Ramat vertical',
    [[
      'Stand tall holding a barbell in front of your thighs with an overhand grip, hands about shoulder-width apart.',
      'Keep the bar close to your body and brace your abs.',
      'Pull the bar straight up along your torso, leading with your elbows, until it reaches about chest height.',
      'Pause with your elbows at or slightly above shoulder height, then lower slowly.',
    ], 'Use a wider grip and don\'t raise your elbows above shoulder level if you feel pinching in your shoulders.'],
    [[
      'Stai drept ținând o bară în fața coapselor cu priza de sus, mâinile la aproximativ lățimea umerilor.',
      'Ține bara aproape de corp și încordează abdomenul.',
      'Trage bara drept în sus pe lângă trunchi, conducând cu coatele, până ajunge aproximativ la nivelul pieptului.',
      'Fă o pauză cu coatele la nivelul umerilor sau puțin deasupra, apoi coboară încet.',
    ], 'Folosește o priză mai largă și nu ridica coatele peste nivelul umerilor dacă simți o presiune în umeri.']),
  ex('shoulder_press_machine', 'shoulders', 'machine', 'Shoulder Press Machine', 'Presă umeri la aparat',
    [[
      'Adjust the seat so the handles are at shoulder height when you sit down. Keep your back against the pad and feet flat on the floor.',
      'Grip the handles with your wrists straight.',
      'Press up until your arms are almost straight, without locking your elbows.',
      'Lower slowly back to shoulder height and repeat.',
    ], 'Keep your head against the pad and don\'t shrug your shoulders to the ears as you press.'],
    [[
      'Reglează scaunul astfel încât mânerele să fie la înălțimea umerilor când te așezi. Ține spatele pe spătar și tălpile pe podea.',
      'Prinde mânerele cu încheieturile drepte.',
      'Împinge în sus până aproape întinzi brațele, fără să blochezi coatele.',
      'Coboară încet la înălțimea umerilor și repetă.',
    ], 'Ține capul pe spătar și nu ridica umerii spre urechi în timp ce împingi.']),
  ex('shrug', 'shoulders', 'dumbbell', 'Dumbbell Shrug', 'Ridicări de umeri (shrugs)',
    [[
      'Stand tall with a dumbbell in each hand at your sides, palms facing your body and arms straight.',
      'Keep your chest up and your eyes forward.',
      'Lift your shoulders straight up toward your ears as high as you can, without bending your elbows.',
      'Hold for a second at the top, then lower slowly until you feel the stretch.',
    ], 'Don\'t roll your shoulders in circles; a straight up-and-down movement is safer and more effective.'],
    [[
      'Stai drept cu câte o ganteră în fiecare mână pe lângă corp, palmele spre corp și brațele întinse.',
      'Ține pieptul sus și privirea înainte.',
      'Ridică umerii drept în sus spre urechi cât de sus poți, fără să îndoi coatele.',
      'Menține o secundă sus, apoi coboară încet până simți întinderea.',
    ], 'Nu roti umerii în cercuri; o mișcare dreaptă sus-jos este mai sigură și mai eficientă.']),

  // Biceps
  ex('barbell_curl', 'biceps', 'barbell', 'Barbell Curl', 'Flexii cu bara',
    [[
      'Stand with feet shoulder-width apart, holding a barbell with an underhand grip, hands shoulder-width apart and arms straight.',
      'Tuck your elbows against your sides and keep your chest up.',
      'Curl the bar up toward your shoulders by bending only at the elbows, squeezing your biceps at the top.',
      'Lower slowly until your arms are fully straight again.',
    ], 'If you have to swing your hips or lean back to lift the bar, reduce the weight.'],
    [[
      'Stai cu picioarele la lățimea umerilor, ținând bara cu priza de jos, mâinile la lățimea umerilor și brațele întinse.',
      'Lipește coatele de lateralul corpului și ține pieptul sus.',
      'Flexează bara spre umeri îndoind doar coatele și strângând bicepsul sus.',
      'Coboară încet până brațele sunt din nou complet întinse.',
    ], 'Dacă trebuie să-ți balansezi șoldurile sau să te apleci pe spate, redu greutatea.']),
  ex('db_curl', 'biceps', 'dumbbell', 'Dumbbell Curl', 'Flexii cu gantere',
    [[
      'Stand or sit holding a dumbbell in each hand at your sides, palms facing forward.',
      'Keep your elbows tucked beside your torso and your shoulders still.',
      'Curl the dumbbells up toward your shoulders, squeezing your biceps at the top.',
      'Lower slowly to a full stretch. You can alternate arms or lift both together.',
    ], 'Don\'t let your elbows drift forward; the movement should come only from the forearm.'],
    [[
      'Stai în picioare sau pe scaun, ținând câte o ganteră în fiecare mână pe lângă corp, palmele spre înainte.',
      'Ține coatele lipite de trunchi și umerii nemișcați.',
      'Flexează ganterele spre umeri, strângând bicepsul sus.',
      'Coboară încet până la întindere completă. Poți alterna brațele sau le poți ridica împreună.',
    ], 'Nu lăsa coatele să meargă înainte; mișcarea trebuie să vină doar din antebraț.']),
  ex('hammer_curl', 'biceps', 'dumbbell', 'Hammer Curl', 'Flexii ciocan',
    [[
      'Stand holding a dumbbell in each hand at your sides, palms facing your body (like holding a hammer).',
      'Keep your elbows pinned to your sides and your shoulders relaxed.',
      'Curl the dumbbells up toward your shoulders without rotating your wrists, so your palms keep facing each other.',
      'Squeeze at the top, then lower slowly to a full stretch.',
    ], 'This variation also trains your forearms and the muscle under your biceps (brachialis).'],
    [[
      'Stai în picioare ținând câte o ganteră în fiecare mână pe lângă corp, palmele spre corp (ca și cum ai ține un ciocan).',
      'Ține coatele lipite de corp și umerii relaxați.',
      'Flexează ganterele spre umeri fără să rotești încheieturile, astfel încât palmele să rămână una spre cealaltă.',
      'Strânge sus, apoi coboară încet până la întindere completă.',
    ], 'Această variantă lucrează și antebrațele și mușchiul de sub biceps (brahial).']),
  ex('preacher_curl', 'biceps', 'barbell', 'Preacher Curl', 'Flexii la banca Scott',
    [[
      'Adjust the seat so your armpits rest on top of the preacher pad. Grab the bar with an underhand grip, shoulder-width apart.',
      'Rest the full length of your upper arms on the pad.',
      'Curl the bar up toward your shoulders, squeezing your biceps at the top.',
      'Lower slowly until your arms are almost straight. Stop just short of locking out your elbows.',
    ], 'Don\'t drop the weight at the bottom; a controlled lowering protects your elbow tendons.'],
    [[
      'Reglează scaunul astfel încât axilele să se sprijine pe marginea de sus a pernei. Prinde bara cu priza de jos, la lățimea umerilor.',
      'Sprijină brațele pe toată lungimea pe pernă.',
      'Flexează bara spre umeri, strângând bicepsul sus.',
      'Coboară încet până brațele sunt aproape întinse. Oprește-te chiar înainte să blochezi coatele.',
    ], 'Nu lăsa greutatea să cadă jos; coborârea controlată protejează tendoanele coatelor.']),
  ex('incline_db_curl', 'biceps', 'dumbbell', 'Incline Dumbbell Curl', 'Flexii cu gantere la bancă înclinată',
    [[
      'Set a bench to about 45–60° and sit back with a dumbbell in each hand, arms hanging straight down behind your torso, palms facing forward.',
      'Keep your head and back against the bench and your elbows pointing at the floor.',
      'Curl the dumbbells up toward your shoulders without moving your upper arms.',
      'Lower slowly to a full stretch, feeling your biceps lengthen at the bottom.',
    ], 'Use lighter weights than a standing curl; the stretched position makes this exercise harder.'],
    [[
      'Setează o bancă la aproximativ 45–60° și stai pe spate cu câte o ganteră în fiecare mână, brațele atârnând în spatele trunchiului, palmele spre înainte.',
      'Ține capul și spatele pe bancă și coatele îndreptate spre podea.',
      'Flexează ganterele spre umeri fără să mișți brațele de sus.',
      'Coboară încet la întindere completă, simțind bicepsul lungindu-se jos.',
    ], 'Folosește greutăți mai mici decât la flexiile în picioare; poziția întinsă face exercițiul mai greu.']),
  ex('cable_curl', 'biceps', 'cable', 'Cable Curl', 'Flexii la cablu',
    [[
      'Attach a straight bar or rope to a low pulley. Stand facing the machine, a step back, with feet shoulder-width apart.',
      'Grab the handle with an underhand grip and keep your elbows tucked beside you.',
      'Curl the handle up toward your shoulders, squeezing your biceps at the top.',
      'Lower slowly, keeping tension on the cable, until your arms are straight.',
    ], 'The cable keeps constant tension on the biceps, even at the bottom, so avoid resting between reps.'],
    [[
      'Atașează o bară dreaptă sau o coardă la un scripete jos. Stai cu fața la aparat, la un pas distanță, cu picioarele la lățimea umerilor.',
      'Prinde mânerul cu priza de jos și ține coatele lipite de corp.',
      'Flexează mânerul spre umeri, strângând bicepsul sus.',
      'Coboară încet, menținând tensiunea în cablu, până brațele sunt întinse.',
    ], 'Cablul menține tensiune constantă pe biceps, chiar și jos, deci evită pauzele între repetări.']),

  // Triceps
  ex('close_grip_bench', 'triceps', 'barbell', 'Close-Grip Bench Press', 'Împins cu priză îngustă',
    [[
      'Lie on a flat bench and grip the bar with your hands about shoulder-width apart (not closer, which strains your wrists).',
      'Unrack the bar and hold it over your chest with straight arms.',
      'Lower the bar slowly to your lower chest, keeping your elbows tucked close to your body.',
      'Press the bar back up until your arms are straight, focusing on pushing with your triceps.',
    ], 'Keep your wrists straight and stacked over your elbows. Use a spotter for heavy sets.'],
    [[
      'Întinde-te pe o bancă orizontală și prinde bara cu mâinile la aproximativ lățimea umerilor (nu mai aproape, ca să nu forțezi încheieturile).',
      'Scoate bara din suport și ține-o deasupra pieptului cu brațele întinse.',
      'Coboară bara încet spre partea de jos a pieptului, ținând coatele aproape de corp.',
      'Împinge bara înapoi până brațele sunt întinse, concentrându-te pe efortul tricepsului.',
    ], 'Ține încheieturile drepte, deasupra coatelor. Folosește un partener de siguranță la seriile grele.']),
  ex('tricep_pushdown', 'triceps', 'cable', 'Triceps Pushdown', 'Extensii triceps la cablu',
    [[
      'Attach a bar or rope to a high pulley. Stand facing the machine with feet shoulder-width apart and lean forward slightly.',
      'Grab the handle and pin your elbows to your sides with your forearms pointing up.',
      'Push the handle down until your arms are fully straight, squeezing your triceps.',
      'Let the handle rise slowly until your forearms are about parallel to the floor, keeping your elbows still.',
    ], 'Your upper arms should not move. If they do, the weight is too heavy.'],
    [[
      'Atașează o bară sau o coardă la un scripete înalt. Stai cu fața la aparat, cu picioarele la lățimea umerilor, și înclină-te ușor înainte.',
      'Prinde mânerul și lipește coatele de corp, cu antebrațele îndreptate în sus.',
      'Împinge mânerul în jos până întinzi complet brațele, strângând tricepsul.',
      'Lasă mânerul să urce încet până antebrațele sunt aproximativ paralele cu podeaua, ținând coatele nemișcate.',
    ], 'Brațele de sus nu trebuie să se miște. Dacă se mișcă, greutatea este prea mare.']),
  ex('skull_crusher', 'triceps', 'barbell', 'Skull Crusher', 'Extensii triceps culcat (skull crusher)',
    [[
      'Lie on a flat bench holding an EZ-bar or barbell with a shoulder-width, overhand grip, arms straight above your chest.',
      'Keep your upper arms still and pointing slightly back over your head.',
      'Bend only your elbows to lower the bar toward your forehead (or just behind your head), slowly.',
      'Extend your arms back to the starting position by squeezing your triceps.',
    ], 'Keep your elbows pointing at the ceiling, not flared out. Use a spotter for heavy weights.'],
    [[
      'Întinde-te pe o bancă orizontală ținând o bară EZ sau o bară dreaptă cu priza de sus la lățimea umerilor, brațele întinse deasupra pieptului.',
      'Ține brațele de sus nemișcate, îndreptate ușor spre spatele capului.',
      'Îndoaie doar coatele pentru a coborî încet bara spre frunte (sau chiar în spatele capului).',
      'Întinde brațele înapoi în poziția de start strângând tricepsul.',
    ], 'Ține coatele îndreptate spre tavan, nu desfăcute în lateral. Folosește un partener la greutăți mari.']),
  ex('overhead_tricep_ext', 'triceps', 'dumbbell', 'Overhead Triceps Extension', 'Extensii triceps deasupra capului',
    [[
      'Stand or sit holding one dumbbell with both hands, cupping the top plate. Raise it straight over your head with arms extended.',
      'Keep your upper arms close to your ears, elbows pointing up.',
      'Bend your elbows to lower the dumbbell slowly behind your head until you feel a deep stretch in your triceps.',
      'Extend your arms back up by squeezing your triceps, without moving your upper arms.',
    ], 'Keep your core tight and avoid arching your back as you lower the weight.'],
    [[
      'Stai în picioare sau pe scaun ținând o ganteră cu ambele mâini, sprijinind discul de sus. Ridic-o drept deasupra capului cu brațele întinse.',
      'Ține brațele de sus aproape de urechi, cu coatele îndreptate în sus.',
      'Îndoaie coatele pentru a coborî ganterea încet în spatele capului, până simți o întindere profundă în triceps.',
      'Întinde brațele înapoi sus strângând tricepsul, fără să miști brațele de sus.',
    ], 'Ține abdomenul încordat și evită arcuirea spatelui în timp ce cobori greutatea.']),
  ex('bench_dip', 'triceps', 'bodyweight', 'Bench Dip', 'Dips la bancă',
    [[
      'Sit on the edge of a bench with your hands next to your hips, fingers pointing forward. Walk your feet out and slide your hips off the bench.',
      'Straighten your arms to support your body, with your legs bent (easier) or straight (harder).',
      'Bend your elbows, pointing them straight back, and lower your hips until your upper arms are about parallel to the floor.',
      'Push through your palms to straighten your arms and return to the top.',
    ], 'Keep your hips close to the bench and don\'t sink your shoulders down toward your ears.'],
    [[
      'Stai pe marginea unei bănci cu mâinile lângă șolduri, degetele spre înainte. Mută picioarele înainte și alunecă șoldurile de pe bancă.',
      'Întinde brațele pentru a susține corpul, cu picioarele îndoite (mai ușor) sau întinse (mai greu).',
      'Îndoaie coatele, îndreptându-le drept în spate, și coboară șoldurile până brațele de sus sunt aproape paralele cu podeaua.',
      'Împinge prin palme pentru a întinde brațele și a reveni sus.',
    ], 'Ține șoldurile aproape de bancă și nu lăsa umerii să se ridice spre urechi.']),
  ex('kickback', 'triceps', 'dumbbell', 'Triceps Kickback', 'Kickback triceps',
    [[
      'Hold a dumbbell in one hand and hinge forward at the hips with a flat back (or rest your free hand and knee on a bench).',
      'Raise your elbow so your upper arm is parallel to the floor and tight against your side, with your forearm hanging down.',
      'Extend your forearm backward until your arm is completely straight, squeezing your triceps.',
      'Slowly return to the start, keeping your upper arm still.',
    ], 'A light weight and strict form work best; don\'t swing the dumbbell.'],
    [[
      'Ține o ganteră într-o mână și apleacă-te din șold cu spatele drept (sau sprijină mâna liberă și un genunchi pe o bancă).',
      'Ridică cotul astfel încât brațul de sus să fie paralel cu podeaua și lipit de corp, cu antebrațul atârnând.',
      'Extinde antebrațul în spate până brațul este complet întins, strângând tricepsul.',
      'Revino încet în poziția de start, ținând brațul de sus nemișcat.',
    ], 'O greutate mică și o tehnică strictă funcționează cel mai bine; nu balansa ganterea.']),

  // Legs
  ex('squat', 'legs', 'barbell', 'Barbell Squat', 'Genuflexiuni cu bara',
    [[
      'Set the bar at upper chest height. Step under it, rest it across your upper back (not on your neck), and grip it just outside your shoulders. Unrack and step back.',
      'Stand with feet shoulder-width apart and toes turned slightly out. Brace your abs and keep your chest up.',
      'Bend your hips and knees together and sit down between your hips, keeping your knees in line with your toes, until your thighs are at least parallel to the floor.',
      'Drive through your whole foot (especially the heels) to stand back up, keeping your chest up and back flat.',
    ], 'Look straight ahead and never let your knees cave inward. Use safety bars when lifting heavy.'],
    [[
      'Setează bara la înălțimea părții de sus a pieptului. Intră sub ea, sprijin-o pe partea de sus a spatelui (nu pe gât) și prinde-o puțin în afara umerilor. Scoate-o din suport și fă un pas înapoi.',
      'Stai cu picioarele la lățimea umerilor și vârfurile ușor spre exterior. Încordează abdomenul și ține pieptul sus.',
      'Îndoaie șoldurile și genunchii împreună și coboară între șolduri, cu genunchii în linie cu vârfurile, până când coapsele sunt cel puțin paralele cu podeaua.',
      'Împinge prin toată talpa (mai ales prin călcâie) pentru a te ridica, cu pieptul sus și spatele drept.',
    ], 'Privește drept înainte și nu lăsa genunchii să cadă spre interior. Folosește opritoare de siguranță la greutăți mari.']),
  ex('front_squat', 'legs', 'barbell', 'Front Squat', 'Genuflexiuni frontale',
    [[
      'Set the bar at upper chest height. Place it across the front of your shoulders and collarbones, with elbows pointing forward and high (clean grip or crossed arms).',
      'Unrack, step back and stand with feet shoulder-width apart, toes slightly out.',
      'Bend your knees and hips, lowering straight down while keeping your torso upright and your elbows high.',
      'Go as deep as you can with a flat back, then drive up through your whole foot.',
    ], 'If your elbows drop, the bar will roll forward; keep them high throughout.'],
    [[
      'Setează bara la înălțimea părții de sus a pieptului. Așaz-o pe partea din față a umerilor și claviculelor, cu coatele înainte și sus (priză clean sau brațe încrucișate).',
      'Scoate-o din suport, fă un pas înapoi și stai cu picioarele la lățimea umerilor, vârfurile ușor spre exterior.',
      'Îndoaie genunchii și șoldurile, coborând drept în jos cu trunchiul vertical și coatele sus.',
      'Coboară cât poți cu spatele drept, apoi împinge prin toată talpa pentru a te ridica.',
    ], 'Dacă lași coatele jos, bara se rostogolește înainte; ține-le sus tot timpul.']),
  ex('leg_press', 'legs', 'machine', 'Leg Press', 'Presă picioare',
    [[
      'Sit in the machine with your back and head flat against the pad. Place your feet shoulder-width apart in the middle of the platform.',
      'Release the safety handles and lower the platform slowly by bending your knees toward your chest.',
      'Go down until your knees are bent about 90° without your lower back lifting off the pad.',
      'Press the platform back up through your whole foot, stopping just before your knees lock out.',
    ], 'Never lock your knees hard at the top and don\'t let your hips curl up at the bottom.'],
    [[
      'Stai în aparat cu spatele și capul lipite de spătar. Pune picioarele la lățimea umerilor în mijlocul platformei.',
      'Eliberează mânerele de siguranță și coboară platforma încet îndoind genunchii spre piept.',
      'Coboară până când genunchii sunt îndoiți la aproximativ 90°, fără ca zona lombară să se dezlipească de spătar.',
      'Împinge platforma înapoi prin toată talpa, oprindu-te chiar înainte de blocarea genunchilor.',
    ], 'Nu bloca niciodată genunchii brusc sus și nu lăsa șoldurile să se rostogolească jos.']),
  ex('lunge', 'legs', 'dumbbell', 'Walking Lunge', 'Fandări',
    [[
      'Stand tall with a dumbbell in each hand at your sides, feet hip-width apart.',
      'Take a long step forward and lower your body until both knees are bent about 90°, with your back knee just above the floor.',
      'Keep your torso upright and your front knee above your ankle, not past your toes.',
      'Push through the heel of your front foot and step your back foot forward into the next lunge. Alternate legs.',
    ], 'Take big enough steps so your front shin stays near vertical. If balance is difficult, hold no weights first.'],
    [[
      'Stai drept cu câte o ganteră în fiecare mână pe lângă corp, picioarele la lățimea șoldurilor.',
      'Fă un pas lung înainte și coboară corpul până ambii genunchi sunt îndoiți la aproximativ 90°, cu genunchiul din spate chiar deasupra podelei.',
      'Ține trunchiul vertical și genunchiul din față deasupra gleznei, nu dincolo de vârfuri.',
      'Împinge prin călcâiul piciorului din față și adu piciorul din spate înainte în următoarea fandare. Alternează picioarele.',
    ], 'Fă pași suficient de mari ca tibia din față să rămână aproape verticală. Dacă echilibrul e dificil, începe fără greutăți.']),
  ex('bulgarian_split_squat', 'legs', 'dumbbell', 'Bulgarian Split Squat', 'Genuflexiuni bulgărești',
    [[
      'Stand about two steps in front of a bench, facing away from it. Place the top of one foot on the bench behind you. Hold a dumbbell in each hand.',
      'Adjust your distance so that, when lowered, your front shin is nearly vertical.',
      'Lower your hips straight down by bending your front knee until your front thigh is about parallel to the floor.',
      'Drive up through your front heel to stand tall. Finish all reps, then switch legs.',
    ], 'Keep most of your weight on your front leg; the back leg is only for balance.'],
    [[
      'Stai la aproximativ doi pași în fața unei bănci, cu spatele la ea. Pune dosul unui picior pe bancă în spatele tău. Ține câte o ganteră în fiecare mână.',
      'Ajustează distanța astfel încât, când cobori, tibia din față să fie aproape verticală.',
      'Coboară șoldurile drept în jos îndoind genunchiul din față până coapsa e aproximativ paralelă cu podeaua.',
      'Împinge prin călcâiul din față pentru a te ridica. Termină toate repetările, apoi schimbă piciorul.',
    ], 'Pune cea mai mare parte din greutate pe piciorul din față; cel din spate ajută doar la echilibru.']),
  ex('leg_extension', 'legs', 'machine', 'Leg Extension', 'Extensii pentru cvadriceps',
    [[
      'Adjust the seat so your knees line up with the machine\'s pivot point and the pad rests on your lower shins, just above your ankles.',
      'Hold the side handles and keep your back against the pad.',
      'Extend your legs until they are straight, squeezing your quads for a second at the top.',
      'Lower slowly back down, stopping just before the weight stack touches.',
    ], 'Don\'t swing the weight up. A slow, controlled movement protects your knees.'],
    [[
      'Reglează scaunul astfel încât genunchii să fie aliniați cu axul aparatului și perna să se sprijine pe partea de jos a gambelor, chiar deasupra gleznelor.',
      'Ține mânerele laterale și spatele lipit de spătar.',
      'Întinde picioarele până sunt drepte, strângând cvadricepsul o secundă sus.',
      'Coboară încet, oprindu-te chiar înainte ca greutățile să se atingă.',
    ], 'Nu arunca greutatea în sus. O mișcare lentă și controlată protejează genunchii.']),
  ex('leg_curl', 'legs', 'machine', 'Leg Curl', 'Flexii pentru femurali',
    [[
      'Adjust the machine so the pad rests just above your heels (on your lower calves) and your knees line up with the pivot.',
      'Lie face down (or sit, depending on the machine) and hold the handles.',
      'Curl your heels toward your glutes by bending your knees, squeezing your hamstrings at the top.',
      'Lower slowly until your legs are almost straight.',
    ], 'Keep your hips pressed down onto the pad; don\'t let them lift as you curl.'],
    [[
      'Reglează aparatul astfel încât perna să stea chiar deasupra călcâielor (pe partea de jos a gambelor) și genunchii să fie aliniați cu axul.',
      'Stai întins cu fața în jos (sau așezat, în funcție de aparat) și ține mânerele.',
      'Flexează călcâiele spre fese îndoind genunchii, strângând femuralii sus.',
      'Coboară încet până picioarele sunt aproape întinse.',
    ], 'Ține șoldurile apăsate pe pernă; nu le lăsa să se ridice în timp ce flexezi.']),
  ex('romanian_deadlift', 'legs', 'barbell', 'Romanian Deadlift', 'Îndreptări românești',
    [[
      'Stand holding a barbell in front of your thighs with an overhand grip, feet hip-width apart, knees slightly bent.',
      'Brace your abs, pull your shoulders back and keep your back flat.',
      'Push your hips straight back, letting the bar slide down your thighs and shins while keeping your knees only softly bent.',
      'Lower until you feel a strong stretch in your hamstrings (usually just below the knees), then drive your hips forward and squeeze your glutes to stand up.',
    ], 'The bar must stay close to your legs the whole time. Stop lowering as soon as your back starts to round.'],
    [[
      'Stai ținând o bară în fața coapselor cu priza de sus, picioarele la lățimea șoldurilor și genunchii ușor îndoiți.',
      'Încordează abdomenul, trage umerii înapoi și ține spatele drept.',
      'Împinge șoldurile drept în spate, lăsând bara să alunece pe coapse și tibii, cu genunchii doar ușor îndoiți.',
      'Coboară până simți o întindere puternică în femurali (de obicei chiar sub genunchi), apoi împinge șoldurile înainte și strânge fesele pentru a te ridica.',
    ], 'Bara trebuie să rămână aproape de picioare tot timpul. Oprește coborârea imediat ce spatele începe să se rotunjească.']),
  ex('goblet_squat', 'legs', 'dumbbell', 'Goblet Squat', 'Genuflexiuni goblet',
    [[
      'Stand with feet slightly wider than shoulder width, toes turned out a little. Hold a dumbbell vertically against your chest with both hands cupping the top end.',
      'Keep your elbows pointing down and your chest tall.',
      'Sit down between your legs by bending your hips and knees, keeping your heels on the floor and your knees in line with your toes.',
      'Go as deep as you comfortably can, then drive through your heels to stand back up.',
    ], 'A great exercise to learn squat form: the weight in front helps you keep an upright torso.'],
    [[
      'Stai cu picioarele puțin mai late decât umerii, vârfurile ușor spre exterior. Ține o ganteră vertical la piept, cu ambele mâini sub capătul de sus.',
      'Ține coatele îndreptate în jos și pieptul sus.',
      'Coboară între picioare îndoind șoldurile și genunchii, cu călcâiele pe podea și genunchii în linie cu vârfurile.',
      'Coboară cât de adânc poți confortabil, apoi împinge prin călcâie pentru a te ridica.',
    ], 'Un exercițiu excelent pentru a învăța tehnica genuflexiunii: greutatea din față te ajută să ții trunchiul vertical.']),
  ex('hack_squat', 'legs', 'machine', 'Hack Squat', 'Hack squat',
    [[
      'Step into the machine and place your shoulders under the pads with your back flat against the backrest. Put your feet shoulder-width apart on the platform.',
      'Release the safety handles and straighten your legs without locking your knees.',
      'Lower slowly by bending your knees until your thighs are parallel to the platform or slightly lower.',
      'Press through your whole foot to return to the start.',
    ], 'Placing your feet lower on the platform emphasizes your quads; higher emphasizes glutes and hamstrings.'],
    [[
      'Intră în aparat și pune umerii sub perne, cu spatele lipit de spătar. Pune picioarele la lățimea umerilor pe platformă.',
      'Eliberează mânerele de siguranță și întinde picioarele fără să blochezi genunchii.',
      'Coboară încet îndoind genunchii până coapsele sunt paralele cu platforma sau puțin mai jos.',
      'Împinge prin toată talpa pentru a reveni în poziția de start.',
    ], 'Picioarele mai jos pe platformă accentuează cvadricepsul; mai sus accentuează fesele și femuralii.']),

  // Glutes
  ex('hip_thrust', 'glutes', 'barbell', 'Hip Thrust', 'Hip thrust',
    [[
      'Sit on the floor with your upper back against the edge of a bench. Roll a barbell over your legs until it rests across your hips (use a pad for comfort).',
      'Plant your feet flat on the floor, hip-width apart, with knees bent.',
      'Drive through your heels and lift your hips until your thighs and torso form a straight line and your shins are vertical.',
      'Squeeze your glutes hard at the top, then lower your hips slowly without touching the floor.',
    ], 'Tuck your chin slightly and keep your ribs down so your lower back doesn\'t over-arch at the top.'],
    [[
      'Stai pe podea cu partea de sus a spatelui sprijinită de marginea unei bănci. Rostogolește o bară peste picioare până se sprijină pe șolduri (folosește o pernă pentru confort).',
      'Pune tălpile pe podea, la lățimea șoldurilor, cu genunchii îndoiți.',
      'Împinge prin călcâie și ridică șoldurile până coapsele și trunchiul formează o linie dreaptă și tibiile sunt verticale.',
      'Strânge puternic fesele sus, apoi coboară șoldurile încet fără să atingi podeaua.',
    ], 'Coboară ușor bărbia și ține coastele jos ca zona lombară să nu se arcuiască excesiv sus.']),
  ex('glute_bridge', 'glutes', 'bodyweight', 'Glute Bridge', 'Pod pentru fesieri',
    [[
      'Lie on your back with your knees bent, feet flat on the floor hip-width apart and arms resting by your sides.',
      'Pull your feet close enough that your fingertips can almost touch your heels.',
      'Push through your heels to lift your hips until your body forms a straight line from shoulders to knees.',
      'Squeeze your glutes for a second at the top, then lower your hips slowly to the floor.',
    ], 'Don\'t push your hips so high that your lower back arches; stop at a straight line.'],
    [[
      'Întinde-te pe spate cu genunchii îndoiți, tălpile pe podea la lățimea șoldurilor și brațele pe lângă corp.',
      'Apropie tălpile astfel încât vârfurile degetelor să poată atinge aproape călcâiele.',
      'Împinge prin călcâie pentru a ridica șoldurile până corpul formează o linie dreaptă de la umeri la genunchi.',
      'Strânge fesele o secundă sus, apoi coboară șoldurile încet pe podea.',
    ], 'Nu ridica șoldurile atât de sus încât zona lombară să se arcuiască; oprește-te la linia dreaptă.']),
  ex('cable_kickback', 'glutes', 'cable', 'Cable Glute Kickback', 'Kickback fesieri la cablu',
    [[
      'Attach an ankle strap to a low pulley and fasten it around one ankle. Face the machine and hold the frame for support, standing a step or two back.',
      'Lean forward slightly with a flat back and a soft bend in your standing knee.',
      'Kick your working leg straight back and slightly up, squeezing your glute at the top.',
      'Return slowly to the start without letting the weight stack rest. Finish all reps, then switch legs.',
    ], 'Keep your hips square to the machine and avoid arching your lower back to swing the leg higher.'],
    [[
      'Atașează o curea de gleznă la un scripete jos și fixeaz-o pe o gleznă. Stai cu fața la aparat, ținându-te de structură pentru sprijin, la unul-doi pași distanță.',
      'Înclină-te ușor înainte cu spatele drept și genunchiul de sprijin ușor îndoit.',
      'Împinge piciorul de lucru drept în spate și puțin în sus, strângând fesierul sus.',
      'Revino încet în poziția de start fără să lași greutățile să se așeze. Termină toate repetările, apoi schimbă piciorul.',
    ], 'Ține șoldurile orientate spre aparat și evită să arcuiești zona lombară pentru a ridica piciorul mai sus.']),
  ex('step_up', 'glutes', 'dumbbell', 'Dumbbell Step-up', 'Urcări pe bancă',
    [[
      'Stand facing a bench or sturdy box (knee height or lower) with a dumbbell in each hand at your sides.',
      'Place your whole right foot on the bench.',
      'Press through your right heel to lift your body up until your leg is straight, bringing your left foot up to meet it (or hovering it).',
      'Step down slowly with the left foot first, keeping control. Finish your reps, then switch legs.',
    ], 'Use your front leg to do the work; don\'t push off the back foot.'],
    [[
      'Stai cu fața la o bancă sau o cutie stabilă (la înălțimea genunchiului sau mai joasă) cu câte o ganteră în fiecare mână pe lângă corp.',
      'Pune întreaga talpă dreaptă pe bancă.',
      'Împinge prin călcâiul drept pentru a ridica corpul până piciorul e întins, aducând piciorul stâng lângă el (sau ținându-l în aer).',
      'Coboară încet cu piciorul stâng primul, păstrând controlul. Termină repetările, apoi schimbă piciorul.',
    ], 'Folosește piciorul din față pentru efort; nu te împinge din piciorul din spate.']),
  ex('sumo_deadlift', 'glutes', 'barbell', 'Sumo Deadlift', 'Îndreptări sumo',
    [[
      'Stand with your feet much wider than shoulder width and toes pointed out about 30–45°. The bar should be over the middle of your feet.',
      'Bend down and grip the bar with your hands inside your knees, arms straight.',
      'Lift your chest, flatten your back and push your knees out over your toes. Take a deep breath and brace.',
      'Drive the floor away with your legs, keeping the bar close to your body, and stand tall with your glutes squeezed. Lower the same way.',
    ], 'Keep your knees pushed out so they track in line with your toes throughout the lift.'],
    [[
      'Stai cu picioarele mult mai late decât umerii și vârfurile orientate spre exterior la aproximativ 30–45°. Bara trebuie să fie deasupra mijlocului tălpilor.',
      'Apleacă-te și prinde bara cu mâinile între genunchi, brațele întinse.',
      'Ridică pieptul, îndreaptă spatele și împinge genunchii în afară, în linie cu vârfurile. Inspiră adânc și încordează trunchiul.',
      'Împinge podeaua cu picioarele, ținând bara aproape de corp, și ridică-te complet strângând fesele. Coboară în același fel.',
    ], 'Ține genunchii împinși în afară, în linie cu vârfurile, pe tot parcursul ridicării.']),

  // Calves
  ex('standing_calf_raise', 'calves', 'machine', 'Standing Calf Raise', 'Ridicări pe vârfuri în picioare',
    [[
      'Position your shoulders under the pads of the machine and place the balls of your feet on the platform, heels hanging off the edge.',
      'Stand tall with your knees straight but not locked.',
      'Rise up onto your toes as high as you can, squeezing your calves at the top for a second.',
      'Lower slowly until your heels drop below the platform and you feel a full stretch.',
    ], 'A full range of motion and a slow tempo matter more than heavy weight for calves.'],
    [[
      'Pune umerii sub pernele aparatului și partea din față a tălpilor pe platformă, cu călcâiele în aer.',
      'Stai drept cu genunchii întinși, dar nu blocați.',
      'Ridică-te pe vârfuri cât de sus poți, strângând gambele o secundă sus.',
      'Coboară încet până călcâiele ajung sub nivelul platformei și simți o întindere completă.',
    ], 'O amplitudine completă și un ritm lent contează mai mult decât greutatea mare la gambe.']),
  ex('seated_calf_raise', 'calves', 'machine', 'Seated Calf Raise', 'Ridicări pe vârfuri din șezut',
    [[
      'Sit at the machine and place the balls of your feet on the platform. Lower the thigh pad so it rests just above your knees.',
      'Release the safety lever so the weight is supported by your calves.',
      'Push through the balls of your feet to lift your heels as high as possible, squeezing for a second.',
      'Lower slowly until your heels drop below the platform and you feel a deep stretch.',
    ], 'The bent knee targets the deeper soleus muscle in your calves; keep a slow tempo and don\'t bounce.'],
    [[
      'Stai pe scaunul aparatului și pune partea din față a tălpilor pe platformă. Coboară perna pentru coapse să se sprijine chiar deasupra genunchilor.',
      'Eliberează maneta de siguranță pentru ca greutatea să fie susținută de gambe.',
      'Împinge prin partea din față a tălpilor pentru a ridica călcâiele cât mai sus, strângând o secundă.',
      'Coboară încet până călcâiele ajung sub nivelul platformei și simți o întindere profundă.',
    ], 'Genunchiul îndoit lucrează mușchiul solear, mai profund; menține ritmul lent și nu ricoșa.']),
  ex('db_calf_raise', 'calves', 'dumbbell', 'Single-Leg Calf Raise', 'Ridicări pe vârfuri la un picior',
    [[
      'Stand on the edge of a step or sturdy block on one foot, with the ball of that foot on the edge and your heel hanging off. Hold a dumbbell in the same-side hand and use the other hand for balance.',
      'Let your heel drop below the level of the step to stretch your calf.',
      'Rise up onto your toes as high as you can, squeezing your calf at the top.',
      'Lower slowly back down. Finish all reps, then switch legs.',
    ], 'Hold a wall or rail with your free hand to stay balanced and keep the movement strict.'],
    [[
      'Stai pe marginea unei trepte sau a unui bloc stabil, pe un picior, cu partea din față a tălpii pe margine și călcâiul în aer. Ține o ganteră în mâna de aceeași parte și folosește cealaltă mână pentru echilibru.',
      'Lasă călcâiul să coboare sub nivelul treptei pentru a întinde gamba.',
      'Ridică-te pe vârfuri cât de sus poți, strângând gamba sus.',
      'Coboară încet. Termină toate repetările, apoi schimbă piciorul.',
    ], 'Ține-te cu mâna liberă de un perete sau o bară pentru echilibru și execută mișcarea strict.']),

  // Core
  ex('plank', 'core', 'bodyweight', 'Plank', 'Plank',
    [[
      'Lie face down and place your forearms on the floor with your elbows directly under your shoulders. Rise onto your toes.',
      'Lift your body into a straight line from head to heels.',
      'Squeeze your abs, glutes and thighs. Don\'t let your hips sag or pike up.',
      'Hold this position while breathing steadily, then lower to the floor.',
    ], 'Start with 20–30 seconds and build up. Stop the set when your form breaks down.'],
    [[
      'Întinde-te cu fața în jos și pune antebrațele pe podea, cu coatele chiar sub umeri. Ridică-te pe vârfuri.',
      'Ridică corpul într-o linie dreaptă de la cap la călcâie.',
      'Încordează abdomenul, fesele și coapsele. Nu lăsa șoldurile să cadă sau să se ridice.',
      'Menține poziția respirând constant, apoi coboară pe podea.',
    ], 'Începe cu 20–30 de secunde și crește treptat. Oprește seria când tehnica se strică.']),
  ex('crunch', 'core', 'bodyweight', 'Crunch', 'Abdomene',
    [[
      'Lie on your back with your knees bent and feet flat on the floor. Place your hands lightly behind your head or across your chest.',
      'Tighten your abs and press your lower back gently into the floor.',
      'Curl your shoulders and upper back off the floor by contracting your abs, keeping your lower back on the ground.',
      'Pause at the top, then lower slowly back down.',
    ], 'Don\'t pull on your neck with your hands. Look at the ceiling and let your abs do the work.'],
    [[
      'Întinde-te pe spate cu genunchii îndoiți și tălpile pe podea. Pune mâinile ușor la ceafă sau încrucișate pe piept.',
      'Încordează abdomenul și apasă ușor zona lombară pe podea.',
      'Ridică umerii și partea de sus a spatelui de pe podea contractând abdomenul, cu zona lombară pe sol.',
      'Fă o pauză sus, apoi coboară încet.',
    ], 'Nu trage de gât cu mâinile. Privește tavanul și lasă abdomenul să facă munca.']),
  ex('hanging_leg_raise', 'core', 'bodyweight', 'Hanging Leg Raise', 'Ridicări de picioare din atârnat',
    [[
      'Hang from a pull-up bar with an overhand grip, arms straight and shoulders pulled slightly down.',
      'Keep your legs together and straight (or with knees bent to make it easier).',
      'Raise your legs by contracting your abs until they are parallel to the floor or higher.',
      'Lower them slowly without swinging, and pause at the bottom before the next rep.',
    ], 'If you swing, stop and reset. Bend your knees if straight legs are too hard.'],
    [[
      'Atârnă de o bară de tracțiuni cu priza de sus, brațele întinse și umerii trași ușor în jos.',
      'Ține picioarele lipite și întinse (sau cu genunchii îndoiți pentru a fi mai ușor).',
      'Ridică picioarele contractând abdomenul până sunt paralele cu podeaua sau mai sus.',
      'Coboară-le încet fără balans și fă o pauză jos înainte de următoarea repetare.',
    ], 'Dacă te balansezi, oprește-te și reia. Îndoaie genunchii dacă picioarele drepte sunt prea grele.']),
  ex('cable_crunch', 'core', 'cable', 'Cable Crunch', 'Abdomene la cablu',
    [[
      'Attach a rope to a high pulley. Kneel facing away from the machine and hold the rope on either side of your head.',
      'Sit your hips back slightly and keep your hips fixed throughout the movement.',
      'Crunch down by rounding your spine, bringing your elbows toward your knees, and squeeze your abs hard.',
      'Return slowly to the start without lifting your hips.',
    ], 'The movement comes from your abs curling your torso, not from pulling with your arms or hinging at the hips.'],
    [[
      'Atașează o coardă la un scripete înalt. Îngenunchează cu spatele la aparat și ține coarda de o parte și de alta a capului.',
      'Împinge șoldurile ușor în spate și ține-le fixe pe tot parcursul mișcării.',
      'Contractă abdomenul rotunjind coloana, aducând coatele spre genunchi, și strânge puternic abdomenul.',
      'Revino încet în poziția de start fără să ridici șoldurile.',
    ], 'Mișcarea vine din abdomen care curbează trunchiul, nu din tragerea cu brațele sau îndoirea din șolduri.']),
  ex('russian_twist', 'core', 'bodyweight', 'Russian Twist', 'Răsuciri rusești',
    [[
      'Sit on the floor with your knees bent and heels on the ground (or lifted for more difficulty).',
      'Lean back slightly until you feel your abs engage, keeping your back straight. Clasp your hands together in front of you.',
      'Rotate your torso to one side, touching your hands (or a weight) to the floor beside your hip.',
      'Rotate smoothly to the other side. One side to the other counts as one rep.',
    ], 'Turn from your ribs and torso, not just by swinging your arms.'],
    [[
      'Stai pe podea cu genunchii îndoiți și călcâiele pe sol (sau ridicate pentru dificultate mai mare).',
      'Înclină-te ușor pe spate până simți abdomenul activat, cu spatele drept. Ține mâinile împreunate în față.',
      'Rotește trunchiul într-o parte, atingând podeaua cu mâinile (sau cu o greutate) lângă șold.',
      'Rotește lin în partea cealaltă. O parte și cealaltă contează ca o repetare.',
    ], 'Rotește din coaste și trunchi, nu doar balansând brațele.']),
  ex('ab_wheel', 'core', 'bodyweight', 'Ab Wheel Rollout', 'Ab wheel',
    [[
      'Kneel on a mat and hold the ab wheel with both hands directly below your shoulders.',
      'Tuck your pelvis slightly, brace your abs and keep your back flat.',
      'Roll the wheel forward slowly, extending your body as far as you can while keeping your core tight and your hips from sagging.',
      'Pull the wheel back toward your knees using your abs, returning to the start.',
    ], 'Start with a short range of motion. If your lower back sags, you\'ve gone too far for now.'],
    [[
      'Îngenunchează pe o saltea și ține roata cu ambele mâini direct sub umeri.',
      'Basculează ușor bazinul, încordează abdomenul și ține spatele drept.',
      'Rulează roata înainte încet, întinzându-ți corpul cât poți, cu abdomenul încordat și fără ca șoldurile să cadă.',
      'Trage roata înapoi spre genunchi folosind abdomenul, revenind în poziția de start.',
    ], 'Începe cu o amplitudine mică. Dacă zona lombară se lasă, ai mers prea departe pentru moment.']),
  ex('leg_raise', 'core', 'bodyweight', 'Lying Leg Raise', 'Ridicări de picioare culcat',
    [[
      'Lie on your back on a mat with your legs straight and your hands under your hips or by your sides.',
      'Press your lower back into the floor and tighten your abs.',
      'Keep your legs straight and raise them together until they point toward the ceiling.',
      'Lower them slowly, stopping just above the floor, without letting your lower back arch.',
    ], 'If your lower back lifts off the floor, bend your knees slightly or don\'t lower your legs as far.'],
    [[
      'Întinde-te pe spate pe o saltea cu picioarele întinse și mâinile sub șolduri sau pe lângă corp.',
      'Apasă zona lombară pe podea și încordează abdomenul.',
      'Ține picioarele drepte și ridică-le împreună până sunt îndreptate spre tavan.',
      'Coboară-le încet, oprindu-te chiar deasupra podelei, fără să arcuiești zona lombară.',
    ], 'Dacă zona lombară se dezlipește de podea, îndoaie ușor genunchii sau nu coborî picioarele atât de jos.']),
];

const BY_ID = new Map(BUILT_IN.map((e) => [e.id, e]));

export function builtInExercises(lang: Lang): Exercise[] {
  return BUILT_IN.map((e) => localize(e, lang));
}

export function builtInExercise(id: string, lang: Lang): Exercise | undefined {
  const e = BY_ID.get(id);
  return e ? localize(e, lang) : undefined;
}

function localize(e: BuiltIn, lang: Lang): Exercise {
  return {
    id: e.id,
    muscle: e.muscle,
    equipment: e.equipment,
    name: e.name[lang],
    howto: e.howto[lang],
    custom: false,
  };
}

export const BUILT_IN_IDS: ReadonlySet<string> = new Set(BUILT_IN.map((e) => e.id));
