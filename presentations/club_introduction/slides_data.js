/**
 * CORE AITU - Presentation Slide Deck Data (v5)
 * Comprehensive, authentic slide deck built directly from official club documents:
 * - Положение о студенческом клубе «CORE» (ДП-AITU-25, Астана, 2026)
 * - План мероприятий I триместр 2026–2027 учебного года
 * - Стратегический роадмап 2026–2030 (Open Source Foundation Kazakhstan)
 * - Развитие прикладной инженерной лаборатории кампуса
 */

const SLIDES_DATA = [
  {
    id: "boot",
    category: "",
    title: "CORE // OPEN SYSTEMS & SECURITY",
    telemetry: "SYSTEM: INITIALIZED // MODEL CORE",
    type: "hero_title",
    content: {
      subtitle: "СТУДЕНЧЕСКИЙ КЛУБ ASTANA IT UNIVERSITY",
      motto: "РАЗВИТИЕ ОТКРЫТЫХ ТЕХНОЛОГИЙ, ЦИФРОВОГО СУВЕРЕНИТЕТА И БЕЗОПАСНОСТИ"
    }
  },
  {
    id: "about",
    category: "SYS.DIAG // ОПРЕДЕЛЕНИЕ И СТАТУС",
    title: "ЧТО ТАКОЕ CORE?",
    telemetry: "NODE: CORE-AITU-HQ",
    type: "about_grid",
    content: {
      lead: "CORE — добровольное академическое, исследовательское и проектное сообщество обучающихся Astana IT University на базе исследовательской лаборатории кампуса. Преемник Linux Klub, ориентированный на открытые системы, системную инженерию и цифровую автономию.",
      acronym: [
        {
          letter: "C",
          word: "CYBERSECURITY",
          desc: "Анализ безопасности цепочек поставок ПО (Supply Chain), регламент Responsible Disclosure, харденинг открытых ОС и практические киберучения на полигонах."
        },
        {
          letter: "O",
          word: "OPEN SOURCE",
          desc: "Контрибуция в свободное программное обеспечение, принцип Open by Default, прозрачность исходного кода и развитие национальных репозиториев ПО."
        },
        {
          letter: "R",
          word: "RESEARCH",
          desc: "Исследования открытых архитектур, аудит пакетных менеджеров, токенизация PyPI и совместная разработка баз уязвимостей совместно с ресерчерами."
        },
        {
          letter: "E",
          word: "ENGINEERING",
          desc: "Системное программирование (Go, Rust, C/C++), контейнерные среды, развертывание и оптимизация локальных моделей ИИ (vLLM, Ollama) на серверных мощностях кампуса."
        }
      ]
    }
  },
  {
    id: "mission_vision",
    category: "MISSION // ПОЛОЖЕНИЕ РАЗДЕЛ 3",
    title: "МИССИЯ И ОПЕРАЦИОННЫЕ ПРИНЦИПЫ",
    telemetry: "FOSS GRAPH // TOPOLOGY",
    type: "globe_split",
    content: {
      mission_title: "ГЛАВНАЯ МИССИЯ КЛУБА",
      mission_text: "Формирование инженерного и исследовательского сообщества для развития открытых технологий, создания отечественных решений и содействия технологической независимости Казахстана.",
      values: [
        { name: "OPEN BY DEFAULT", desc: "Проектная документация, исходный код, методические материалы и финансовый журнал по умолчанию публикуются в открытом доступе." },
        { name: "RESPONSIBLE DISCLOSURE", desc: "Регламент ответственного раскрытия уязвимостей: студенты-исследователи находятся под академической защитой Клуба и университета без риска санкций." },
        { name: "PURPLE TEAMING", desc: "Проактивная безопасность на стыке Red Team (пентест) и Blue Team (SOC) — совместные исследования рисков сторонних открытых библиотек." },
        { name: "ГОРИЗОНТАЛЬНАЯ КОЛЛЕГИЯ", desc: "Плоская самоуправляемая команда (Стафф): все члены равны по статусу, а решения принимаются коллегиально на основе консенсуса." }
      ]
    }
  },
  {
    id: "leads",
    category: "STRUCTURE // РАЗДЕЛ 5 ПОЛОЖЕНИЯ",
    title: "ГОРИЗОНТАЛЬНАЯ МОДЕЛЬ УПРАВЛЕНИЯ",
    telemetry: "ПЛОСКАЯ КОЛЛЕГИЯ // 3D HERO ROSTER",
    type: "horizontal_hero_3d",
    content: {
      lead: "В CORE отсутствует жесткая вертикальная иерархия. Руководство осуществляется горизонтальной Координационной коллегией из 6 профильных лидеров с равным правом голоса.",
      roles: [
        {
          id: "coord",
          code: "HERO-01",
          title: "КООРДИНАТОР КЛУБА",
          unit: "ФАСИЛИТАЦИЯ",
          tag: "ELECTED LEAD // 1 YEAR MANDATE",
          gear: "HOLOGRAPHIC COMPASS & BEACON",
          tasks: "Связующее лицо перед Студенческим правительством, ДСВР, администрацией AITU и внешними партнерами. Фасилитирует общие собрания, модерирует голосования Коллегии и обеспечивает соблюдение Положения ДП-AITU-25."
        },
        {
          id: "dev",
          code: "HERO-02",
          title: "DEVELOPMENT & OPEN SOURCE",
          unit: "РАЗРАБОТКА",
          tag: "CORE REPOSITORIES & FOSS",
          gear: "CYBERDECK TERMINAL & HACKER VISOR",
          tasks: "Курирует официальные репозитории Клуба на GitHub/GitLab, организует строгое peer review и менторство студенческих проектов, ведет разработку университетских FOSS-утилит и национальных реестров пакетов."
        },
        {
          id: "sec",
          code: "HERO-03",
          title: "SECURITY & SYSTEMS RESEARCH",
          unit: "ИССЛЕДОВАНИЯ / ИБ",
          tag: "SUPPLY CHAIN & SEC RESEARCH",
          gear: "DEFENSE SHIELD & SCANNER PROBE",
          tasks: "Координирует прикладные R&D исследования лаборатории, аудит безопасности цепочек поставок ПО (Supply Chain), внедрение регламента Responsible Disclosure и подготовку к киберучениям."
        },
        {
          id: "edu",
          code: "HERO-04",
          title: "EDUCATION & COMMUNITY",
          unit: "ОБУЧЕНИЕ",
          tag: "EDUCATION & ONBOARDING",
          gear: "DATA PRISM & KNOWLEDGE BASE",
          tasks: "Курирует образовательные треки, регулярные воркшопы по установке и настройке Linux для новичков, организацию внутренних лекций и шеринг инженерных практик."
        },
        {
          id: "events",
          code: "HERO-05",
          title: "EVENTS & LOGISTICS",
          unit: "МЕРОПРИЯТИЯ",
          tag: "HACKATHONS & SPEECH SESSIONS",
          gear: "TACTICAL TRANSCEIVER & TIMETABLE",
          tasks: "Организует хакатоны по открытому ПО с призовыми фондами, открытые Speech Sessions с приглашенными экспертами-практиками, квест-игры и онлайн-мероприятия, а также бронирование локаций."
        },
        {
          id: "media",
          code: "HERO-06",
          title: "MEDIA / SMM & PR-ПАРТНЕРСТВА",
          unit: "КОММУНИКАЦИИ",
          tag: "COMMUNITY CHANNELS & OUTREACH",
          gear: "BROADCAST ANTENNA & MEGAPHONE",
          tasks: "Ведет официальные медиа-ресурсы и Telegram-канал Клуба, выпускает технические гайды, видео-челленджи («Неделя на Linux после Windows») и выстраивает стратегические связи с IT-компаниями."
        }
      ]
    }
  },
  {
    id: "research_projects",
    category: "RESEARCH & CODE // ИНИЦИАТИВЫ",
    title: "ПРАКТИЧЕСКИЕ ПРОЕКТЫ КЛУБА",
    telemetry: "PROJECT REPOSITORIES",
    type: "events_list",
    content: {
      events: [
        {
          badge: "RESEARCH",
          title: "SUPPLY CHAIN RADAR & PYPI TOKENIZATION",
          freq: "Активный R&D",
          desc: "Разработка открытого радара безопасности цепочек поставок ПО для мониторинга уязвимостей и вредоносных внедрений в открытых библиотеках."
        },
        {
          badge: "INFRASTRUCTURE",
          title: "NATIONAL PACKAGE REGISTRY & REPOSITORIES",
          freq: "В разработке",
          desc: "Разработка концепции национального реестра доверенных пакетов и репозиториев свободного ПО для обеспечения технологической независимости и безопасности обновлений."
        },
        {
          badge: "AUTOMATION",
          title: "CAMPUS LAB TELEGRAM BOT",
          freq: "Тестирование",
          desc: "Служебный Telegram-бот для исследовательской лаборатории, уведомлений студентов о расписании мероприятий, доступов и координации проектных групп."
        },
        {
          badge: "OPEN SYSTEMS",
          title: "OPEN CORE & HARDWARE SECURITY",
          freq: "Исследование",
          desc: "Исследование моделей открытых систем по принципу Trezor / Flipper Zero: открытые исходные коды прошивок при защищенной аппаратной архитектуре."
        }
      ]
    }
  },
  {
    id: "events",
    category: "CALENDAR // I ТРИМЕСТР 2026–2027",
    title: "ПЛАН МЕРОПРИЯТИЙ КЛУБА",
    telemetry: "УТВЕРЖДЕННЫЙ ГРАФИК",
    type: "events_list",
    content: {
      events: [
        {
          title: "ПРЕЗЕНТАЦИЯ КЛУБА CORE (OPEN SPACE)",
          desc: "Знакомство с обновленным форматом Клуба, преемственностью Linux Klub, целями на учебный год и открытым набором в Координационную коллегию."
        },
        {
          title: "КВЕСТ-ИГРЫ И ОНЛАЙН-МЕРОПРИЯТИЯ",
          desc: "Инженерные и CTF-квесты, анализ сетевых протоколов, криптографические испытания, стеганография и командные онлайн-соревнования для студентов."
        },
        {
          title: "SPEECH SESSIONS #1 & #2 (АУДИТОРИЯ)",
          desc: "Выступления участников Клуба и приглашенных экспертов-практиков (криминалисты по криптовалютам, ресерчеры ИБ, системные инженеры)."
        },
        {
          title: "OPEN SOURCE DAY & RED/BLUE TEAM ВОРКШОП",
          desc: "Помощь студентам с установкой и настройкой Linux + воркшоп по харденингу операционных систем и отражению сетевых атак."
        }
      ]
    }
  },

  {
    id: "metrics",
    category: "GOVERNANCE // РАЗДЕЛЫ 7-8",
    title: "ПРИНЦИПЫ И ОТКРЫТЫЙ БЮДЖЕТ",
    telemetry: "OPEN BY DEFAULT",
    type: "stats_dashboard",
    content: {
      metrics: [
        { num: "250K ₸", label: "ПРИЗОВОЙ ФОНД ХАКАТОНА" },
        { num: "100%", label: "ОТКРЫТЫЙ БЮДЖЕТ (OPEN BY DEFAULT)" },
        { num: "SSCI GPA", label: "БАЛЛЫ АКТИВИСТАМ ЗА ПРОЕКТЫ" },
        { num: "0-DAY", label: "RESPONSIBLE DISCLOSURE ЗАЩИТА" }
      ],
      highlights: [
        "Открытый финансовый журнал: учет всех поступлений от IT-индустрии, грантов и бюджета AITU доступен любому члену сообщества.",
        "Академическая защита исследователей: при этичном поиске уязвимостей по регламенту Responsible Disclosure студент защищен от санкций.",
        "Баллы SSCI GPA: авторы лучших открытых проектов, докладов и победители соревнований выдвигаются на соискание баллов AITU."
      ]
    }
  },
  {
    id: "roadmap",
    category: "ROADMAP // РАЗДЕЛ 9 ПОЛОЖЕНИЯ",
    title: "СТРАТЕГИЧЕСКИЙ РОАДМАП 2026–2030",
    telemetry: "3 ЭТАПА РАЗВИТИЯ",
    type: "roadmap_timeline",
    content: {
      steps: [
        {
          phase: "ЭТАП I: СТАНОВЛЕНИЕ И ВНУТРИКАМПУСНОЕ ПРИЗНАНИЕ (2026–2027)",
          active: true,
          desc: "Регулярные воркшопы по Linux и открытым системам, проведение открытого хакатона по отечественным FOSS-утилитам (призовой фонд от 250 000 ₸), концепция национального реестра пакетов и репозиториев, медиа-челленджи."
        },
        {
          phase: "ЭТАП II: БЕЗОПАСНОСТЬ, ИИ И МЕЖВУЗОВСКАЯ ИНТЕГРАЦИЯ (2027–2028)",
          active: false,
          desc: "Разработка Supply Chain Radar, внедрение шаблонов Local AI без утечки данных, ТЭО перевода аудиторных ПК на Linux, межвузовские воркшопы и соревнования."
        },
        {
          phase: "ЭТАП III: ИНСТИТУЦИОНАЛИЗАЦИЯ И ЦИФРОВАЯ АВТОНОМИЯ (2029–2030)",
          active: false,
          desc: "Масштабирование инициатив Клуба до уровня независимого фонда Open Source Foundation Kazakhstan, тренинги по открытому ПО для госсектора и бизнеса, доверенные национальные репозитории."
        }
      ]
    }
  },
  {
    id: "recruitment",
    category: "ONBOARDING // ВСТУПЛЕНИЕ В КЛУБ",
    title: "КАК СТАТЬ ЧАСТЬЮ СООБЩЕСТВА",
    telemetry: "ОТБОР В СТАФФ",
    type: "recruitment_steps",
    content: {
      lead: "Сообщество CORE открыто для всех студентов AITU, преподавателей и внешних энтузиастов.",
      stages: [
        {
          num: "01",
          title: "АУДИТОРИЯ КЛУБА",
          desc: "Свободное участие во всех открытых митапах, Speech Sessions, воркшопах в университетской лаборатории и дискуссиях в Telegram без отбора."
        },
        {
          num: "02",
          title: "PULL REQUESTS",
          desc: "Контрибуция в репозитории Клуба под свободными лицензиями (MIT, Apache 2.0, GPLv3), получение обратной связи и код-ревью."
        },
        {
          num: "03",
          title: "АНКЕТА В СТАФФ",
          desc: "Подача заявки в Координационную коллегию через открытую анкету с выбором роли (Dev, Security, SMM, Events, Education)."
        },
        {
          num: "04",
          title: "КОЛЛЕГИЯ И ЛАБОРАТОРИЯ",
          desc: "Включение в состав Коллегии по решению участников, доступы к серверам, оборудованию исследовательской лаборатории и запуск проектов."
        }
      ]
    }
  },
  {
    id: "outro",
    category: "UPLINK // СВЯЗЬ И КОНТАКТЫ",
    title: "КОНТАКТЫ И ОФИЦИАЛЬНЫЕ КАНАЛЫ",
    telemetry: "STANDBY // ОЖИДАНИЕ",
    type: "outro_terminal",
    content: {
      channels: [
        { name: "GITHUB ОРГАНИЗАЦИЯ", value: "github.com/core-aitu" },
        { name: "БАЗОВАЯ ЛОКАЦИЯ", value: "Кампус AITU" }
      ],
      qr_codes: [
        { src: "./qr_1.jpg", alt: "CORE Telegram QR 1" },
        { src: "./qr_2.jpg", alt: "CORE Telegram QR 2" }
      ]
    }
  }
];
