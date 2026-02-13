import { useEffect, useMemo, useRef, useState } from 'react';

const ppeItems = [
  {
    id: 'seams',
    label: 'Seams',
    detail: 'Seams intact; stitching not frayed.',
    x: 49,
    y: 37
  },
  {
    id: 'shell',
    label: 'Outer Shell',
    detail: 'No rips, tears, or shell damage.',
    x: 52,
    y: 48
  },
  {
    id: 'barrier',
    label: 'Vapor Barrier',
    detail: 'Vapor barrier intact and undamaged.',
    x: 44,
    y: 56
  },
  {
    id: 'closures',
    label: 'Closures',
    detail: 'Zippers, Velcro, and closures function properly.',
    x: 50,
    y: 62
  },
  {
    id: 'helmet',
    label: 'Helmet',
    detail: 'Helmet meets NFPA standard; chin strap secured.',
    x: 50,
    y: 14
  },
  {
    id: 'boots',
    label: 'Boots',
    detail: 'Boots NFPA-compliant, undamaged, with adequate tread.',
    x: 50,
    y: 88
  },
  {
    id: 'gloves',
    label: 'Gloves',
    detail: 'Gloves NFPA-compliant for structural firefighting, properly fitted, and undamaged.',
    x: 30,
    y: 54
  },
  {
    id: 'facepiece',
    label: 'SCBA Facepiece',
    detail: 'SCBA facepiece properly fitted; lens undamaged; seal intact with no dry rot, tears, or damage.',
    x: 50,
    y: 24
  }
];

const sceneItems = [
  {
    id: 'apparatus',
    label: 'Apparatus',
    detail: 'Single apparatus: noise plus vehicle movement/backing hazards.',
    x: 18,
    y: 58
  },
  {
    id: 'smoke',
    label: 'Smoke',
    detail: 'Smoke creates inhalation hazards and requires proper SCBA use.',
    x: 54,
    y: 18
  },
  {
    id: 'structure',
    label: 'Involved Structure Zone',
    detail: 'Area near the involved structure has burn and injury risk; proper PPE use is required.',
    x: 66,
    y: 50
  },
  {
    id: 'hose',
    label: 'Hose on Ground',
    detail: 'Hose on ground is a trip hazard.',
    x: 49,
    y: 80
  }
];

function HotspotLayer({ items, discovered, activeId, onPreview, onSelect, ariaLabel }) {
  return (
    <div className="hotspot-layer" role="list" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isFound = discovered[item.id];

        return (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className={`hotspot ${isActive ? 'active' : ''} ${isFound ? 'found' : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onMouseEnter={() => onPreview(item.id)}
            onFocus={() => onPreview(item.id)}
            onClick={() => onSelect(item.id)}
            aria-pressed={isFound}
            aria-label={`${item.label}${isFound ? ' (found)' : ''}`}
          >
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Progress({ found, total, label }) {
  return (
    <p className="progress" aria-live="polite">
      {label}: {found} of {total} found
    </p>
  );
}

function App() {
  const [ppeDiscovered, setPpeDiscovered] = useState(() => Object.fromEntries(ppeItems.map((item) => [item.id, false])));
  const [sceneDiscovered, setSceneDiscovered] = useState(() => Object.fromEntries(sceneItems.map((item) => [item.id, false])));

  const [activePpeId, setActivePpeId] = useState(ppeItems[0].id);
  const [activeSceneId, setActiveSceneId] = useState(sceneItems[0].id);
  const hasPostedComplete = useRef(false);

  const ppeFound = useMemo(() => Object.values(ppeDiscovered).filter(Boolean).length, [ppeDiscovered]);
  const sceneFound = useMemo(() => Object.values(sceneDiscovered).filter(Boolean).length, [sceneDiscovered]);
  const totalFound = ppeFound + sceneFound;
  const totalItems = ppeItems.length + sceneItems.length;

  const activePpeItem = ppeItems.find((item) => item.id === activePpeId) ?? ppeItems[0];
  const activeSceneItem = sceneItems.find((item) => item.id === activeSceneId) ?? sceneItems[0];

  useEffect(() => {
    const complete = ppeFound === ppeItems.length && sceneFound === sceneItems.length;
    if (complete && !hasPostedComplete.current) {
      window.parent.postMessage({ type: 'complete' }, '*');
      hasPostedComplete.current = true;
    }
  }, [ppeFound, sceneFound]);

  const selectPpe = (id) => {
    setActivePpeId(id);
    setPpeDiscovered((prev) => ({ ...prev, [id]: true }));
  };

  const selectScene = (id) => {
    setActiveSceneId(id);
    setSceneDiscovered((prev) => ({ ...prev, [id]: true }));
  };

  const restart = () => {
    setPpeDiscovered(Object.fromEntries(ppeItems.map((item) => [item.id, false])));
    setSceneDiscovered(Object.fromEntries(sceneItems.map((item) => [item.id, false])));
    setActivePpeId(ppeItems[0].id);
    setActiveSceneId(sceneItems[0].id);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Spot the Hazard</h1>
        <Progress found={totalFound} total={totalItems} label="Overall progress" />
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>Part 1: PPE Gear Inspection</h2>
          <Progress found={ppeFound} total={ppeItems.length} label="PPE checkpoints" />
        </div>

        <div className="stage-grid">
          <figure className="scene ppe-scene" aria-label="Firefighter in full PPE with SCBA">
            <svg viewBox="0 0 100 100" className="art" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="bgPpe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a2f60" />
                  <stop offset="100%" stopColor="#0a1736" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#bgPpe)" rx="3" />
              <ellipse cx="50" cy="14" rx="13" ry="7" fill="#ffb81c" />
              <circle cx="50" cy="22" r="6" fill="#334f89" />
              <rect x="40" y="30" width="20" height="34" rx="6" fill="#f2c14c" />
              <rect x="31" y="34" width="8" height="24" rx="3" fill="#e8b746" />
              <rect x="61" y="34" width="8" height="24" rx="3" fill="#e8b746" />
              <rect x="42" y="64" width="7" height="22" rx="2" fill="#cc9f3f" />
              <rect x="51" y="64" width="7" height="22" rx="2" fill="#cc9f3f" />
              <rect x="40" y="86" width="11" height="8" rx="2" fill="#101820" />
              <rect x="49" y="86" width="11" height="8" rx="2" fill="#101820" />
              <rect x="64" y="35" width="10" height="24" rx="3" fill="#2f3e5e" />
              <circle cx="50" cy="22" r="3" fill="#d5e4ff" />
            </svg>

            <HotspotLayer
              items={ppeItems}
              discovered={ppeDiscovered}
              activeId={activePpeId}
              onPreview={setActivePpeId}
              onSelect={selectPpe}
              ariaLabel="PPE inspection hotspots"
            />
          </figure>

          <aside className="callout" aria-live="polite">
            <h3>{activePpeItem.label}</h3>
            <p>{activePpeItem.detail}</p>
          </aside>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Part 2: Fire Scene Hazard Identification</h2>
          <Progress found={sceneFound} total={sceneItems.length} label="Scene hazards" />
        </div>

        <div className="stage-grid">
          <figure className="scene fire-scene" aria-label="Fire scene with selectable hazards">
            <svg viewBox="0 0 100 100" className="art" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="bgScene" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3c2e1d" />
                  <stop offset="100%" stopColor="#11131a" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#bgScene)" rx="3" />
              <rect x="8" y="60" width="24" height="13" rx="2" fill="#b52a1d" />
              <rect x="10" y="56" width="17" height="5" rx="1" fill="#d03f2f" />
              <circle cx="14" cy="75" r="3" fill="#20252f" />
              <circle cx="26" cy="75" r="3" fill="#20252f" />
              <rect x="56" y="38" width="30" height="28" rx="2" fill="#564033" />
              <rect x="60" y="45" width="7" height="9" fill="#11131a" />
              <rect x="70" y="45" width="7" height="9" fill="#11131a" />
              <path d="M53 79 C60 75, 70 84, 80 78" stroke="#ffb81c" strokeWidth="2" fill="none" />
              <ellipse cx="62" cy="22" rx="16" ry="8" fill="#5c6472" opacity="0.65" />
              <ellipse cx="67" cy="16" rx="12" ry="6" fill="#7a8291" opacity="0.55" />
            </svg>

            <HotspotLayer
              items={sceneItems}
              discovered={sceneDiscovered}
              activeId={activeSceneId}
              onPreview={setActiveSceneId}
              onSelect={selectScene}
              ariaLabel="Fire scene hazard hotspots"
            />
          </figure>

          <aside className="callout" aria-live="polite">
            <h3>{activeSceneItem.label}</h3>
            <p>{activeSceneItem.detail}</p>
          </aside>
        </div>
      </section>

      <div className="actions">
        <button type="button" className="restart" onClick={restart}>
          Restart Activity
        </button>
      </div>
    </main>
  );
}

export default App;
