'use server';

function getScriptUrl() {
  const url = process.env.NEXT_PUBLIC_SHEETS_URL;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SHEETS_URL env var');
  }

  return url;
}

function rowToReview(row) {
  return {
    employeeName: row?.[0] || '',
    outputQuality: Number(row?.[1]) || 0,
    attendance: Number(row?.[2]) || 0,
    teamwork: Number(row?.[3]) || 0,
    comment: row?.[4] || '',
    timestamp: row?.[5] || null,
  };
}

export async function getReviews(employeeName) {
  const url = getScriptUrl();

  const res = await fetch(url, { cache: 'no-store' });
  const rows = await res.json();

  if (!Array.isArray(rows)) return [];

  let reviews = rows
    .filter((row) => Array.isArray(row) && row.length >= 5)
    .map(rowToReview);

  // filter by employee if needed
  if (employeeName) {
    reviews = reviews.filter(
      (r) => r.employeeName === employeeName
    );
  }

  return reviews;
}

export async function saveReview(review) {
  const url = getScriptUrl();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      employee: review.employeeName,
      quality: review.outputQuality,
      attendance: review.attendance,
      teamwork: review.teamwork,
      comment: review.comment,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error('Could not save review.');
  }

  return data;
}