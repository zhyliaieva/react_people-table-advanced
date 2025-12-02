import { Person } from '../types/Person';
import { PersonLink } from '../components/PersonLink';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type PeopleTableProps = {
  people: Person[];
  loading?: boolean;
};

export const PeopleTable: React.FC<PeopleTableProps> = ({
  people,
  loading,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      setSelectedSlug(slug);
    }
  }, [slug]);

  return (
    <>
      {people.length > 0 && !loading && (
        <table
          data-cy="peopleTable"
          className="table is-striped is-hoverable is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            {people.map((person: Person) => (
              <tr
                data-cy="person"
                key={person.slug}
                className={
                  selectedSlug?.trim() === person.slug.trim()
                    ? 'has-background-warning'
                    : ''
                }
                onClick={() => setSelectedSlug(person.slug.trim())}
              >
                <td>
                  <PersonLink personName={person.name} people={people} />
                </td>

                <td>{person.sex}</td>
                <td>{person.born}</td>
                <td>{person.died}</td>

                <td>
                  <PersonLink personName={person.motherName} people={people} />
                </td>
                <td>
                  <PersonLink personName={person.fatherName} people={people} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
