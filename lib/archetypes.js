// lib/archetypes.js
// Full archetype data — referenced by results page and downstream AI reports

export const OFFICE_LABELS = {
  apostolic: ['Pioneer', 'Apostle', 'Architect', 'Founder', 'Sender'],
  prophetic: ['Seer', 'Prophet', 'Watchman', 'Discerner', 'Oracle'],
  evangelistic: ['Gatherer', 'Evangelist', 'Herald', 'Inviter', 'Caller'],
  pastoral: ['Shepherd', 'Pastor', 'Guardian', 'Keeper', 'Nurturer'],
  teaching: ['Scholar', 'Teacher', 'Sage', 'Interpreter', 'Clarifier'],
};

export const OVERLAY_DISPLAY = {
  builder: 'Builder',
  burden_bearer: 'Burden Bearer',
  reformer: 'Reformer',
  covenant_keeper: 'Covenant Keeper',
  equipper: 'Equipper',
};

export const ARCHETYPES = {
  // ─── APOSTOLIC (1-5) ────────────────────────────────────────────────
  apostolic_builder: {
    office: 'apostolic',
    overlay: 'builder',
    who: [
      "You are not a builder who happens to be apostolic. You are apostolic in the sending — and what you are sent to do is build. Where the pure Apostle plants something new, you don't just plant it. You structure it. You architect it. You put foundations underneath it that outlast you.",
      "This combination is rare. Most Apostles break ground and hand it to a Builder to finish. You do both — and that is both your strength and your risk.",
    ],
    assignment: "You are called to establish — not just initiate. Where others get the word and move to the next territory, you were sent to stay long enough for the thing to stand. Your assignment is infrastructure, not inspiration. Organizations, movements, communities, and Kingdom structures that last beyond one generation bear the fingerprint of an Apostolic Builder somewhere in their foundation.",
    strength: "You see the end from the beginning. While others are still celebrating the groundbreaking, you are already drawing the fifth-floor blueprints. This is why assignments others abandoned become sustainable in your hands.",
    temptation: "The Apostolic Builder rarely rests. You can confuse sustaining the build with being the build. When the structure depends on your hands too long, you stop being the builder and become the scaffolding. Your formation work is learning to build things that can stand without you.",
    scripture: { text: "According to the grace of God which was given to me, as a wise master builder I have laid the foundation, and another builds on it.", ref: "1 Corinthians 3:10" },
  },
  apostolic_burden_bearer: {
    office: 'apostolic',
    overlay: 'burden_bearer',
    who: [
      "You are not a burden bearer who happens to pioneer. You are apostolic in your sending — and what you are sent to carry is the weight others cannot. You are sent to bear what no one before you has had to bear, in territory no one has walked yet.",
      "This combination explains the loneliness you have lived with. There is no one ahead of you to model what you carry, because you are the first one sent here.",
    ],
    assignment: "You are called to bear weight that establishes territory for others. The burdens you carry now are not random suffering. They are the cost of pioneering. Whatever you steward through faithfully becomes the ceiling raised for the next generation of leaders.",
    strength: "You can sustain weight in places no one else can stay. You have learned that being alone with God is not isolation — it is intimacy with the One who sent you. Your endurance is the proof of your authorization.",
    temptation: "You can pick up burdens that were assignments for a season and forget to lay them down when the season ends. Your formation work is learning the difference between the weight you were sent to bear and the weight you have inherited by default.",
    scripture: { text: "Bear one another's burdens, and so fulfill the law of Christ. For each one shall bear his own load.", ref: "Galatians 6:2, 5" },
  },
  apostolic_reformer: {
    office: 'apostolic',
    overlay: 'reformer',
    who: [
      "You are not a reformer who happens to be sent. You are apostolic in your sending — and what you are sent to do is dismantle and rebuild. You do not protest. You replace. You do not just point at what is broken — you carry the blueprint of what comes next.",
      "Most reformers without apostolic sending become bitter critics. You were sent to build the alternative.",
    ],
    assignment: "You are called to confront inherited frameworks and establish new ones. Your work is not destruction for its own sake — it is foundation work. You see what others have accepted as permanent and recognize it was always temporary.",
    strength: "You can hold both the critique and the solution at the same time. While others either complain or comply, you carry the weight of confronting AND the burden of constructing. People sense you are not just frustrated. You are sent.",
    temptation: "You can move to dismantle before you have established trust. Your conviction is real, but conviction without relational equity becomes spiritual violence. Your formation work is learning when to confront publicly and when to build privately first.",
    scripture: { text: "See, I have this day set you over the nations and over the kingdoms, to root out and to pull down, to destroy and to throw down, to build and to plant.", ref: "Jeremiah 1:10" },
  },
  apostolic_covenant_keeper: {
    office: 'apostolic',
    overlay: 'covenant_keeper',
    who: [
      "You are not a covenant keeper who happens to be sent. You are apostolic in your sending — and what you are sent to do is establish covenant where none has existed. You don't just keep covenants. You establish them.",
      "This combination is the work of nation-building, organizational founding, and Kingdom alliances that outlast their founders.",
    ],
    assignment: "You are called to be the relational architect of your sphere. You are sent to form alliances, draw together unlikely partners, and establish covenant agreements that hold something together when pressure tries to scatter it. Your assignment is permanence in a culture of disposable relationships.",
    strength: "You see covenant before others see it. Where others see networking opportunities, you see destiny alignments. People trust you with weight others would never carry — they sense you are not playing the same game.",
    temptation: "You can confuse loyalty with assignment, staying in alliances God has already released you from because the covenant feels sacred. Your formation work is learning that some covenants are seasonal apostolic work — and ending them faithfully is as much your assignment as forming them was.",
    scripture: { text: "Now therefore, let us make a covenant before the Lord between you and me, and let it be a witness between us.", ref: "1 Samuel 20:42" },
  },
  apostolic_equipper: {
    office: 'apostolic',
    overlay: 'equipper',
    who: [
      "You are not an equipper who happens to be sent. You are apostolic in your sending — and what you are sent to do is raise others up to be sent themselves. Your work is reproducing your own apostolic grace in others — not so they imitate you, but so they are released into territories you will never reach.",
      "This combination is the original Ephesians 4 mandate. You are not building a ministry. You are building ministers.",
    ],
    assignment: "You are called to raise sent ones. Your assignment is multi-generational — you are not measured by what you build but by who you build into. You are sent to make yourself increasingly unnecessary in their lives so they can be increasingly necessary in their own assignments.",
    strength: "You see leadership in people before they see it in themselves. You can name the calling on someone before they have language for it. This is your apostolic gift expressed through equipping — calling forth what is dormant and deploying what is forming.",
    temptation: "You can confuse mentorship with control, keeping leaders under your covering after the assignment to send them has come. Your formation work is learning that the height of your equipping ministry is releasing leaders you would prefer to keep.",
    scripture: { text: "And He Himself gave some to be apostles... for the equipping of the saints for the work of ministry.", ref: "Ephesians 4:11-12" },
  },

  // ─── PROPHETIC (6-10) ───────────────────────────────────────────────
  prophetic_builder: {
    office: 'prophetic',
    overlay: 'builder',
    who: [
      "You are not a builder who happens to be prophetic. You are prophetic in your discernment — and what you are sent to do is build what you have seen. You don't just hear the word. You frame the structure that brings the word into the earth.",
      "This combination is the architectural prophet — the one who sees the thing finished before the foundation is poured.",
    ],
    assignment: "You are called to build what God has shown you. Your prophetic insight is not separate from your work — it is the blueprint for it. Whether you build organizations, ministries, businesses, or movements, the thing you build is the manifestation of what you saw before others could see it.",
    strength: "You don't have to imagine what could be — you have already seen it. While others deliberate, you are already three moves ahead because you saw the end before you started. This is why your builds carry weight prophetically.",
    temptation: "You can see the next phase so clearly that you forget others have not seen it yet. Your formation work is learning to build at the speed others can sustain — without losing the vision in the slowdown.",
    scripture: { text: "Where there is no revelation, the people cast off restraint; but happy is he who keeps the law.", ref: "Proverbs 29:18" },
  },
  prophetic_burden_bearer: {
    office: 'prophetic',
    overlay: 'burden_bearer',
    who: [
      "You are not a burden bearer who happens to discern. You are prophetic in your discernment — and what you are sent to bear is what you see before others see it. You carry weight that has not yet manifested. You grieve over outcomes that have not yet happened.",
      "This combination is the most misunderstood archetype in the framework. People around you often think you are dramatic, exaggerating, or worrying — when in reality you are carrying what God is grieving over.",
    ],
    assignment: "You are called to bear prophetic burdens before they become public crises. Your weight is preparatory. The grief you carry is not for you — it is intercession on behalf of what you discern coming. Your burden bearing is warfare.",
    strength: "You feel what others cannot feel yet. While others read the surface, you are reading the spirit underneath. Your sensitivity is not a flaw to manage. It is the instrument of your assignment.",
    temptation: "You can take on burdens that were given to you to intercede over and start carrying them as if they were your own grief. Your formation work is learning to release the burden after you have stewarded it.",
    scripture: { text: "Oh, that my head were waters, and my eyes a fountain of tears, that I might weep day and night for the slain of the daughter of my people!", ref: "Jeremiah 9:1" },
  },
  prophetic_reformer: {
    office: 'prophetic',
    overlay: 'reformer',
    who: [
      "You are not a reformer who happens to be prophetic. You are prophetic in your discernment — and what you are sent to confront is what God Himself is confronting. You do not pick your battles. You discern them. When you speak, you speak with prophetic weight, not personal opinion.",
      "This combination is the most theologically ancient archetype in the framework. It is Jeremiah. It is Amos. It is John the Baptist.",
    ],
    assignment: "You are called to confront on God's behalf, not your own. Your assignment is to speak the word that exposes — not for its own sake, but to bring people back to alignment. Your reformer mandate is restoration through confrontation.",
    strength: "You can hold both truth and tears. You confront with grief — and that combination is what makes your voice land with weight. People sense you are not enjoying this. You are obedient to it.",
    temptation: "You can confuse seeing something with being sent to address it. Discernment is not the same as commission. Your formation work is learning to wait for the word — recognizing that prophetic insight without prophetic timing creates damage you will spend years repairing.",
    scripture: { text: "For the Lord God does nothing, unless He reveals His secret to His servants the prophets.", ref: "Amos 3:7" },
  },
  prophetic_covenant_keeper: {
    office: 'prophetic',
    overlay: 'covenant_keeper',
    who: [
      "You are not a covenant keeper who happens to discern. You are prophetic in your discernment — and what you are sent to keep is covenant the Spirit has revealed. Your loyalty is not personal preference. It is prophetic obedience.",
      "This combination is the rarest in the prophetic family. Most prophets are sent to disrupt. You are sent to remain.",
    ],
    assignment: "You are called to be a prophetic anchor inside covenant relationships. Where others discern and move, you discern and stay. You are the one who carries the prophetic weight of an assignment without abandoning the people inside of it.",
    strength: "You can discern an issue without leaving the table. Most prophets see a problem and remove themselves from it. You see the same problem and recognize that your prophetic presence is part of God's solution.",
    temptation: "You can confuse faithfulness with captivity, remaining in agreements God has already ended because the loyalty feels biblical. Your formation work is learning that prophetic departure is sometimes the highest form of prophetic faithfulness.",
    scripture: { text: "He who walks with integrity, and works righteousness... He who swears to his own hurt and does not change.", ref: "Psalm 15:2, 4" },
  },
  prophetic_equipper: {
    office: 'prophetic',
    overlay: 'equipper',
    who: [
      "You are not an equipper who happens to be prophetic. You are prophetic in your discernment — and what you are sent to equip is the prophetic capacity in others. You don't just teach skills. You activate gifts. Your training is impartation. Your mentorship is commissioning.",
      "This combination is the maker of prophetic voices.",
    ],
    assignment: "You are called to raise prophetic leaders. Your assignment is the development of discernment in others — teaching them to hear, to see, to wait, and to speak with accuracy and weight. The voices you train will reach territories you will never walk into.",
    strength: "You can see prophetic gifting in its raw form. Where others see emotional people or strange behavior, you see prophetic instinct that needs forming. You can move them from one into the other.",
    temptation: "You see their gift so clearly that you can mistake your sight of them for their actual maturity. Your formation work is learning to equip patiently — recognizing that prophetic gift without prophetic character creates prophets who wound the body of Christ.",
    scripture: { text: "Now to each one the manifestation of the Spirit is given for the common good.", ref: "1 Corinthians 12:7" },
  },

  // ─── EVANGELISTIC (11-15) ───────────────────────────────────────────
  evangelistic_builder: {
    office: 'evangelistic',
    overlay: 'builder',
    who: [
      "You are not a builder who happens to evangelize. You are evangelistic in your reach — and what you are sent to do is build what gathers. You don't just draw a crowd. You construct a place for the crowd to land.",
      "This combination explains why your builds always end up with people in them. You don't have to chase them. They find you because what you build was made for them.",
    ],
    assignment: "You are called to construct gathering places — physical, digital, organizational, or spiritual. Your assignment is to build the structures that turn invitation into belonging. The places you create become known as places where people who didn't fit anywhere else finally do.",
    strength: "You can see the room before the people arrive. You design with the gathered in mind from the foundation. This is why your builds feel different — they were always meant to hold the very people who eventually fill them.",
    temptation: "You can build something that gathers well but no longer forms anyone — and miss the shift because the numbers still look right. Your formation work is learning to measure depth alongside breadth.",
    scripture: { text: "Then the master said to the servant, 'Go out into the highways and hedges, and compel them to come in, that my house may be filled.'", ref: "Luke 14:23" },
  },
  evangelistic_burden_bearer: {
    office: 'evangelistic',
    overlay: 'burden_bearer',
    who: [
      "You are not a burden bearer who happens to gather. You are evangelistic in your reach — and what you are sent to bear is the weight of those who are not yet here. You carry people you have not yet met. You grieve over communities you have not yet entered.",
      "This combination is the most pastoral of the evangelistic archetypes. You don't gather for numbers. You gather for souls — and you carry every soul like it is your own.",
    ],
    assignment: "You are called to bear the weight of the absent. Your assignment is intercession on behalf of those who don't know they need intercession yet. Your burden bearing is the spiritual labor that opens the door for the evangelistic work.",
    strength: "You feel the weight of those who are missing. Where others count who is in the room, you count who is not yet there. This is why your evangelism has substance — it is not driven by metrics but by mourning.",
    temptation: "You can carry the weight of someone's salvation as if it depended on you alone — and burn out under what was never yours to finish. Your formation work is learning the difference between bearing the burden of the lost and trying to be their savior.",
    scripture: { text: "I have great sorrow and unceasing anguish in my heart for the sake of my brethren.", ref: "Romans 9:2-3" },
  },
  evangelistic_reformer: {
    office: 'evangelistic',
    overlay: 'reformer',
    who: [
      "You are not a reformer who happens to gather. You are evangelistic in your reach — and what you are sent to confront is what keeps people from being gathered. You confront the gatekeepers on behalf of the gathered.",
      "This combination is the most disruptive of the evangelistic family. You will not just invite people in. You will tear down the doors that were keeping them out.",
    ],
    assignment: "You are called to dismantle the barriers between people and belonging. Your assignment is to confront the religious culture, the cultural assumptions, the institutional walls that have kept the wrong people out. You are sent to redefine who is welcome.",
    strength: "You can name what others are afraid to name. While others adapt to broken systems, you confront them on behalf of the very people those systems have wounded. You are tearing down the structure to make room for them.",
    temptation: "You can become so focused on the barriers that you forget the people on the other side of them. Your formation work is learning to confront strategically — recognizing that some walls need to be torn down with patience.",
    scripture: { text: "Woe to you, scribes and Pharisees, hypocrites! For you shut up the kingdom of heaven against men.", ref: "Matthew 23:13" },
  },
  evangelistic_covenant_keeper: {
    office: 'evangelistic',
    overlay: 'covenant_keeper',
    who: [
      "You are not a covenant keeper who happens to gather. You are evangelistic in your reach — and what you are sent to gather is people into covenant, not just into rooms. Your evangelism is not transactional. It is covenantal — and that is why people who come in under your gathering tend to stay for decades.",
      "This combination is the most relationally rich of the evangelistic archetypes. You don't have a list of converts. You have a family.",
    ],
    assignment: "You are called to gather people into long-term covenant community. Your assignment is to combine the reach of the evangelist with the keeping power of the covenant maker — drawing people in and then holding them through the seasons that test their faith.",
    strength: "You see covenant as the destination, not just the door. While others measure evangelism by who walked in, you measure it by who is still walking with you years later.",
    temptation: "The reach of the evangelist outpaces the relational bandwidth of the covenant keeper, and people who came in under the promise of belonging end up under-shepherded. Your formation work is learning to gather at the speed you can keep.",
    scripture: { text: "And the Lord added to the church daily those who were being saved. And they continued steadfastly.", ref: "Acts 2:47, 42" },
  },
  evangelistic_equipper: {
    office: 'evangelistic',
    overlay: 'equipper',
    who: [
      "You are not an equipper who happens to gather. You are evangelistic in your reach — and what you are sent to equip is the evangelistic capacity in others. You don't just gather. You raise gatherers. The leaders you train carry your reach into territories you will never personally enter.",
      "This combination is the rarest in the evangelistic family. Most evangelists do the work themselves. You teach others to do it.",
    ],
    assignment: "You are called to raise people who gather. Your assignment is to equip ordinary believers with the courage, the language, and the strategy to do the work of the evangelist in their own spheres. You are sent to demystify evangelism.",
    strength: "You can see evangelistic gifting in places others have missed. You recognize the gatherer in the shy person, the herald in the introvert. You see what God has placed in them and you draw it out.",
    temptation: "You can train the skill set but neglect the soul work — and watch the people you trained burn out before their assignment finishes. Your formation work is learning to equip whole people.",
    scripture: { text: "And He Himself gave some... evangelists... for the equipping of the saints.", ref: "Ephesians 4:11-12" },
  },

  // ─── PASTORAL (16-20) ───────────────────────────────────────────────
  pastoral_builder: {
    office: 'pastoral',
    overlay: 'builder',
    who: [
      "You are not a builder who happens to shepherd. You are pastoral in your care — and what you are sent to build is the structure that protects the flock. You don't just love people. You construct frameworks where people are loved well after you are no longer the one personally loving them.",
      "This combination is the maker of healthy churches, healthy organizations, and healthy families. You build for safety, not just function.",
    ],
    assignment: "You are called to build pastoral infrastructure. Your assignment is to design the rhythms, structures, and systems that allow shepherding to scale without losing its soul. You are sent to make sure the second generation under your covering receives the same quality of care as the first.",
    strength: "You can build with people in mind from the first sketch. The care is in the design. People sense the building itself was made to hold them, not just to function around them.",
    temptation: "You can construct an environment so safe that people stop developing the resilience they were meant to grow. Your formation work is learning to build environments that care for people without infantilizing them.",
    scripture: { text: "He shall feed His flock like a shepherd; He shall gather the lambs with His arm, and carry them in His bosom.", ref: "Isaiah 40:11" },
  },
  pastoral_burden_bearer: {
    office: 'pastoral',
    overlay: 'burden_bearer',
    who: [
      "You are not a burden bearer who happens to shepherd. You are pastoral in your care — and what you are sent to bear is the weight of the people in your care. You feel their pain before they tell you. You sense their drift before they realize they are drifting.",
      "This combination is the most consuming archetype in the framework. The pastoral grace runs deep, and the burden bearer overlay means you do not have a natural release valve. Everything stays with you.",
    ],
    assignment: "You are called to bear the weight of those entrusted to you. Your assignment is intercession through proximity — you don't just pray for your people from a distance. You carry them by being close. The weight is the proof of the assignment.",
    strength: "You feel things others don't notice. While other shepherds need their sheep to tell them what is wrong, you sense it in the room before words are spoken. Your people come to you when they would not go to anyone else.",
    temptation: "You absorb without releasing. You convince yourself that carrying it all is what love requires — and discover too late that what love actually required was teaching others to carry their own. Your formation work is learning that releasing weight is not abandonment.",
    scripture: { text: "Cast your burden on the Lord, and He shall sustain you; He shall never permit the righteous to be moved.", ref: "Psalm 55:22" },
  },
  pastoral_reformer: {
    office: 'pastoral',
    overlay: 'reformer',
    who: [
      "You are not a reformer who happens to shepherd. You are pastoral in your care — and what you are sent to confront is what is harming the flock. Your reformer voice is aimed at systems because those systems are wounding the people you love. You confront because you protect.",
      "This combination is the most fierce of the pastoral family. Most shepherds defuse conflict. You will create it — but only on behalf of those who cannot defend themselves.",
    ],
    assignment: "You are called to confront on behalf of the protected. Your assignment is to be the voice that says no to what is harming your people — abusive leaders, broken systems, cultural lies. You are sent to stand between the flock and the wolves.",
    strength: "You can confront without abandoning. Pure reformers will burn down the system and walk away. You confront the system and stay with the people inside of it. Your reform actually heals.",
    temptation: "The intensity of your protective instinct can turn into its own form of control over the very people you were defending. Your formation work is learning that wounded shepherds wound their own flock without realizing it.",
    scripture: { text: "I am the good shepherd. The good shepherd gives His life for the sheep.", ref: "John 10:11" },
  },
  pastoral_covenant_keeper: {
    office: 'pastoral',
    overlay: 'covenant_keeper',
    who: [
      "You are not a covenant keeper who happens to shepherd. You are pastoral in your care — and what you keep is covenant with the people you have shepherded. You don't move on from people. You stay with them through the seasons most leaders would have used as exit ramps.",
      "This combination is the longest-tenured archetype in the framework. Pastoral Covenant Keepers shepherd the same people for decades — sometimes for life.",
    ],
    assignment: "You are called to be the constant in changing seasons. Your assignment is faithfulness over time. You are sent to be the person who is still there when others have left. You are the steady ground.",
    strength: "You can stay when staying costs you. Where others negotiate exits, you keep your word. People who came under your shepherding 20 years ago still send you their hardest news first.",
    temptation: "You can remain in shepherding assignments long after God has released you — because leaving feels like betrayal even when staying has become disobedience. Your formation work is learning that prophetic release from a covenant assignment is not relational abandonment.",
    scripture: { text: "Who then is a faithful and wise servant, whom his master made ruler over his household?", ref: "Matthew 24:45" },
  },
  pastoral_equipper: {
    office: 'pastoral',
    overlay: 'equipper',
    who: [
      "You are not an equipper who happens to shepherd. You are pastoral in your care — and what you are sent to equip is the shepherding capacity in others. You raise pastors. You make care reproducible. You are the shepherd of shepherds.",
      "This combination is the multiplier of pastoral grace.",
    ],
    assignment: "You are called to raise leaders who shepherd well. Your assignment is to model, mentor, and reproduce healthy pastoral leadership — confronting the celebrity-pastor patterns that have wounded the church and replacing them with quieter, more sustainable models.",
    strength: "You can spot pastoral capacity in unlikely places. Where others look for charisma, you look for character. The leaders you raise often surprise the room.",
    temptation: "You can produce shepherds who shepherd exactly like you — and miss the diversity God intended in their assignments. Your formation work is learning to equip people to be themselves in their pastoral grace.",
    scripture: { text: "Shepherd the flock of God which is among you, serving as overseers, not by compulsion but willingly.", ref: "1 Peter 5:2" },
  },

  // ─── TEACHING (21-25) ───────────────────────────────────────────────
  teaching_builder: {
    office: 'teaching',
    overlay: 'builder',
    who: [
      "You are not a builder who happens to teach. You are teaching in your grace — and what you are sent to build is the framework that makes truth teachable. You don't just give answers. You build curricula, courses, books, frameworks that let others learn what you understand without needing you in the room every time.",
      "This combination is the maker of education that lasts longer than the educator.",
    ],
    assignment: "You are called to construct teaching infrastructure. Your assignment is to take what is in your head and translate it into structures that outlive your immediate presence. You are sent to build for clarity at scale. The frameworks you leave behind are part of your assignment.",
    strength: "You can see how truth fits together before others can see the pieces. While they collect facts, you see the architecture. Anyone who interacts with what you have constructed walks away understanding more than they did before.",
    temptation: "You can build systems so airtight that they replace the need for revelation. Your formation work is learning to leave intentional gaps in your frameworks — recognizing that the highest teaching builds toward mystery, not over it.",
    scripture: { text: "Be watchful in all things, endure afflictions, do the work of an evangelist, fulfill your ministry.", ref: "2 Timothy 4:5" },
  },
  teaching_burden_bearer: {
    office: 'teaching',
    overlay: 'burden_bearer',
    who: [
      "You are not a burden bearer who happens to teach. You are teaching in your grace — and what you are sent to bear is the weight of what others do not understand. You carry confusion. You grieve when truth is distorted. The burden of the Teaching Burden Bearer is unclarified truth.",
      "You are not bearing personal pain. You are bearing the cost of what people do not yet know — and what is happening to them because of it.",
    ],
    assignment: "You are called to bear the burden of clarity. Your assignment is to wrestle with truth on behalf of those who cannot or will not wrestle with it themselves. The hours you spend in study are intercessory. They are not academic. They are pastoral.",
    strength: "You can carry complexity without simplifying it prematurely. While others reach for the clean answer, you sit with the question until the answer earns its clarity. What you teach has weight.",
    temptation: "You can confuse intellectual rigor with spiritual obedience — staying in the study so long that you stop teaching, or teaching with such qualified precision that no one can hear you. Your formation work is learning that the burden of clarity exists to be released to others.",
    scripture: { text: "Be diligent to present yourself approved to God, a worker who does not need to be ashamed, rightly dividing the word of truth.", ref: "2 Timothy 2:15" },
  },
  teaching_reformer: {
    office: 'teaching',
    overlay: 'reformer',
    who: [
      "You are not a reformer who happens to teach. You are teaching in your grace — and what you are sent to confront is what people have been taught wrongly. You teach with edge because you are not just informing — you are re-forming what has been malformed.",
      "This combination is one of the most influential archetypes in church history. The Reformation itself was carried by Teaching Reformers who refused to let inherited error remain unchallenged.",
    ],
    assignment: "You are called to dismantle inherited frameworks and replace them with truth. Your assignment is to confront what has been taught for so long that it now feels like Scripture itself — and to do it with enough scholarship that your confrontation cannot be dismissed as opinion.",
    strength: "You can hold both the critique and the alternative simultaneously. People sense you are not just frustrated. You actually know what you are talking about.",
    temptation: "You can become so convinced of your accuracy that you lose your humility — and find that the people you most needed to reach have stopped listening. Your formation work is learning to teach with prophetic patience.",
    scripture: { text: "Be transformed by the renewing of your mind, that you may prove what is that good and acceptable and perfect will of God.", ref: "Romans 12:2" },
  },
  teaching_covenant_keeper: {
    office: 'teaching',
    overlay: 'covenant_keeper',
    who: [
      "You are not a covenant keeper who happens to teach. You are teaching in your grace — and what you are sent to keep is covenant with the truth itself. You do not bend doctrine for popularity. Your loyalty is not to a tradition. It is to the integrity of what you have been given to teach.",
      "Most teachers eventually negotiate with their teaching to keep their audience. You don't.",
    ],
    assignment: "You are called to be the keeper of true teaching across seasons of cultural pressure. Your assignment is to remain faithful to what is right — even when what is right becomes unpopular, inconvenient, or controversial.",
    strength: "You can teach the same truth through changing seasons without compromising it. People return to your teaching across decades. It does not feel dated. It feels durable.",
    temptation: "You can become so committed to truth-as-content that you forget truth-as-relationship — confusing theological precision with pastoral love. Your formation work is learning that keeping covenant with truth and keeping covenant with people are the same assignment.",
    scripture: { text: "Take heed to yourself and to the doctrine. Continue in them, for in doing this you will save both yourself and those who hear you.", ref: "1 Timothy 4:16" },
  },
  teaching_equipper: {
    office: 'teaching',
    overlay: 'equipper',
    who: [
      "You are not an equipper who happens to teach. You are teaching in your grace — and what you are sent to equip is the teaching capacity in others. You don't just teach. You teach people how to teach. You build teachers.",
      "This combination is the multiplier of teaching grace — the maker of teachers.",
    ],
    assignment: "You are called to raise teachers. Your assignment is to demystify teaching for those who carry the gift but have not been trained to use it. Your highest assignment is not the teaching you do personally, but the teachers you reproduce.",
    strength: "You can recognize teaching capacity in its raw form. Where others see someone who explains things well, you see future teachers who need to be sharpened. You have the patience to develop slowly.",
    temptation: "You can keep refining the people you are training, never declaring them ready, because you can always see one more thing they need to learn. Your formation work is learning that release is part of equipping.",
    scripture: { text: "And the things that you have heard from me among many witnesses, commit these to faithful men who will be able to teach others also.", ref: "2 Timothy 2:2" },
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────

export function getArchetype(archetypeId) {
  return ARCHETYPES[archetypeId] || null;
}

export function getOfficeLabels(office) {
  return OFFICE_LABELS[office] || [];
}

export function getOverlayDisplay(overlay) {
  return OVERLAY_DISPLAY[overlay] || overlay;
}

export function formatArchetypeTitle(office, overlay, selectedLabel) {
  const overlayDisplay = getOverlayDisplay(overlay);
  return `${selectedLabel} ${overlayDisplay}`;
}
