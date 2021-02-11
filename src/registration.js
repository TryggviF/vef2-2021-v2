import express from 'express';

// TODO skráningar virkni
const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

export function matchPattern(s) {
  return s.match(nationalIdPattern);
}

export function template(name = '', nationalId = '', annad = '') {
  return `
    <form method="post" action="/post">
      <label>
        Nafn:
        <input required type="text" name="name" value="${name}">
      </label>
      <label>
        Kennitala:
        <input
          required
          type="text"
          pattern="${nationalIdPattern}"
          name="nationalId"
          value="${nationalId}"
        >
      </label>
      <label>
        Athugasemd:
        <input
          type="text"
          name="annad"
          value="${annad}"
        >
      <button>Senda</button>
    </form>
    `;
}
