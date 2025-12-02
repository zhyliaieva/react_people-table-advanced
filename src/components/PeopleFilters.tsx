import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get('query') || '');

  const [selectedCenturies, setSelectedCenturies] = useState<string[]>([]);
  const location = useLocation();

  const centuries = ['16', '17', '18', '19', '20', '21'];

  const updateParams = (fn: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(searchParams);

    fn(p);
    setSearchParams(p);
  };

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setQuery(value);
    updateParams(p => {
      if (value === '') {
        p.delete('query');
      } else {
        p.set('query', value);
      }
    });
  }

  function resetAllFilters() {
    setQuery('');

    searchParams.delete('query');
    searchParams.delete('userId');
    searchParams.delete('centuries');
  }

  function toggleCentury(century: string) {
    updateParams(params => {
      const current = params.getAll('centuries');

      if (current.includes(century)) {
        const newCenturies = current.filter(c => c !== century);

        params.delete('centuries');
        newCenturies.forEach(c => params.append('centuries', c));
      } else {
        params.append('centuries', century);
      }

      setSelectedCenturies(params.getAll('centuries'));
    });
  }

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
    setSelectedCenturies(searchParams.getAll('centuries'));
  }, [searchParams]);

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <Link
          to={{ pathname: '/people', search: location.search }}
          className={location.pathname === '/' ? 'is-active' : '`'}
        >
          All
        </Link>
        <a className="" href="#/people?sex=m">
          Male
        </a>
        <a className="" href="#/people?sex=f">
          Female
        </a>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            value={query}
            onChange={handleQueryChange}
            className="input"
            placeholder="Search"
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {centuries.map(centuryItem => (
              <Link
                data-cy="century"
                to={`#/people?centuries=${centuryItem}`}
                key={centuryItem}
                onClick={() => toggleCentury(centuryItem)}
                className={classNames('button', {
                  'is-info': selectedCenturies.includes(centuryItem),
                  'mr-1': true,
                })}
              >
                {centuryItem}
              </Link>
            ))}
          </div>

          <div className="level-right ml-4">
            <a
              data-cy="centuryALL"
              className="button is-success is-outlined"
              href="#/people"
            >
              All
            </a>
          </div>
        </div>
      </div>

      <div className="panel-block">
        {selectedCenturies.length > 0 ||
          (query !== '' && (
            <Link
              className="button is-link is-outlined is-fullwidth"
              to="#/people"
              onClick={resetAllFilters}
            >
              Reset all filters
            </Link>
          ))}
      </div>
    </nav>
  );
};
