import React from 'react';
import { Calculator, Gauge, RotateCcw, Ruler, Settings2, Weight } from 'lucide-react';

const CAPACITIES = [
  {
    id: 25,
    body: 25,
    capacity: 25,
    height: 0.08,
    width: 0.18,
    chainFactor: 0.066,
    toothCount: 10,
    defaults: { length: '1', density: '0,77', rpm: '66' },
  },
  {
    id: 50,
    body: 50,
    capacity: 50,
    height: 0.135,
    width: 0.18,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '1', density: '0,77', rpm: '54' },
  },
  {
    id: 75,
    body: 75,
    capacity: 75,
    height: 0.2,
    width: 0.18,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '1', density: '0,77', rpm: '54' },
  },
  {
    id: 100,
    body: 100,
    capacity: 100,
    height: 0.21,
    width: 0.23,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '1', density: '0,77', rpm: '54' },
  },
  {
    id: 150,
    body: 150,
    capacity: 150,
    height: 0.227,
    width: 0.305,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '30', density: '0,77', rpm: '54' },
  },
  {
    id: 200,
    body: 200,
    capacity: 200,
    height: 0.22,
    width: 0.42,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '1', density: '0,77', rpm: '54' },
  },
  {
    id: 250,
    body: 250,
    capacity: 250,
    height: 0.256,
    width: 0.45,
    chainFactor: 0.1016,
    toothCount: 9,
    defaults: { length: '1', density: '0,77', rpm: '54' },
  },
  {
    id: 300,
    body: 300,
    capacity: 300,
    height: 0.36,
    width: 0.45,
    chainFactor: 0.1016,
    toothCount: 12,
    defaults: { length: '1', density: '0,77', rpm: '34' },
  },
];

const numberFormatter = new Intl.NumberFormat('tr-TR', {
  maximumFractionDigits: 4,
});

const resultFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseDecimal(value) {
  if (typeof value !== 'string') return Number(value);
  const normalized = value.trim().replace(',', '.');
  return normalized === '' ? Number.NaN : Number(normalized);
}

function formatDecimal(value) {
  return numberFormatter.format(value);
}

function calculate(capacity, formValues) {
  const length = parseDecimal(formValues.length);
  const density = parseDecimal(formValues.density);
  const rpm = parseDecimal(formValues.rpm);

  const chainSpeed = (capacity.chainFactor * capacity.toothCount * rpm) / 60;
  const transmission = capacity.height * capacity.width * density * chainSpeed * 3600;
  const motor = (transmission * length) / (367 * 0.94);

  return {
    length,
    density,
    rpm,
    chainSpeed,
    transmission,
    motor,
    isValid: [length, density, rpm, chainSpeed, transmission, motor].every(Number.isFinite),
  };
}

function App() {
  const [selectedCapacityId, setSelectedCapacityId] = React.useState(CAPACITIES[0].id);
  const selectedCapacity = CAPACITIES.find((item) => item.id === selectedCapacityId);
  const [formValues, setFormValues] = React.useState(selectedCapacity.defaults);
  const results = calculate(selectedCapacity, formValues);

  function selectCapacity(capacityId) {
    const nextCapacity = CAPACITIES.find((item) => item.id === capacityId);
    setSelectedCapacityId(nextCapacity.id);
    setFormValues(nextCapacity.defaults);
  }

  function updateValue(key, value) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetDefaults() {
    setFormValues(selectedCapacity.defaults);
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Konveyör kapasite</p>
            <h1>Hesaplayıcı</h1>
          </div>
          <div className="capacity-badge">
            <Gauge aria-hidden="true" size={20} />
            <span>{selectedCapacity.capacity} t/h</span>
          </div>
        </header>

        <div className="layout-grid">
          <section className="panel input-panel" aria-labelledby="capacity-title">
            <div className="section-heading">
              <Settings2 aria-hidden="true" size={20} />
              <h2 id="capacity-title">Kapasite</h2>
            </div>

            <div className="capacity-grid" role="list" aria-label="Kapasite seçenekleri">
              {CAPACITIES.map((item) => (
                <button
                  className={item.id === selectedCapacityId ? 'capacity-option is-selected' : 'capacity-option'}
                  key={item.id}
                  onClick={() => selectCapacity(item.id)}
                  type="button"
                >
                  <span>{item.capacity}</span>
                  <small>t/h</small>
                </button>
              ))}
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Yoğunluk</span>
                <input
                  inputMode="decimal"
                  onChange={(event) => updateValue('density', event.target.value)}
                  type="text"
                  value={formValues.density}
                />
              </label>
              <label className="field">
                <span>Metraj</span>
                <input
                  inputMode="decimal"
                  onChange={(event) => updateValue('length', event.target.value)}
                  type="text"
                  value={formValues.length}
                />
              </label>
              <label className="field">
                <span>Devir</span>
                <input
                  inputMode="decimal"
                  onChange={(event) => updateValue('rpm', event.target.value)}
                  type="text"
                  value={formValues.rpm}
                />
              </label>
            </div>

            <button className="reset-button" onClick={resetDefaults} type="button">
              <RotateCcw aria-hidden="true" size={18} />
              Varsayılana dön
            </button>
          </section>

          <section className="panel result-panel" aria-labelledby="result-title">
            <div className="section-heading">
              <Calculator aria-hidden="true" size={20} />
              <h2 id="result-title">Sonuçlar</h2>
            </div>

            <div className="result-grid">
              <article className="result-tile accent-green">
                <span>Zincir Hızı</span>
                <strong>{results.isValid ? resultFormatter.format(results.chainSpeed) : '-'}</strong>
                <small>m/sn</small>
              </article>
              <article className="result-tile accent-blue">
                <span>İletim</span>
                <strong>{results.isValid ? resultFormatter.format(results.transmission) : '-'}</strong>
                <small>t/h</small>
              </article>
              <article className="result-tile accent-red">
                <span>Motor</span>
                <strong>{results.isValid ? resultFormatter.format(results.motor) : '-'}</strong>
                <small>kW</small>
              </article>
            </div>

            <div className="formula-strip">
              <p>
                Zincir Hızı = {formatDecimal(selectedCapacity.chainFactor)} * {selectedCapacity.toothCount} * Devir / 60
              </p>
              <p>
                İletim = {formatDecimal(selectedCapacity.height)} * {formatDecimal(selectedCapacity.width)} * Yoğunluk *
                Zincir Hızı * 3600
              </p>
              <p>Motor = İletim * Metraj / (367 * 0,94)</p>
            </div>
          </section>
        </div>

        <section className="spec-band" aria-label="Sabit değerler">
          <div className="spec-item">
            <Weight aria-hidden="true" size={18} />
            <span>Gövde</span>
            <strong>{selectedCapacity.body}</strong>
          </div>
          <div className="spec-item">
            <Ruler aria-hidden="true" size={18} />
            <span>Yükseklik</span>
            <strong>{formatDecimal(selectedCapacity.height)}</strong>
          </div>
          <div className="spec-item">
            <Ruler aria-hidden="true" size={18} />
            <span>Genişlik</span>
            <strong>{formatDecimal(selectedCapacity.width)}</strong>
          </div>
          <div className="spec-item">
            <Settings2 aria-hidden="true" size={18} />
            <span>Zincir Katsayısı</span>
            <strong>{formatDecimal(selectedCapacity.chainFactor)}</strong>
          </div>
          <div className="spec-item">
            <Gauge aria-hidden="true" size={18} />
            <span>Diş Sayısı</span>
            <strong>{selectedCapacity.toothCount}</strong>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
