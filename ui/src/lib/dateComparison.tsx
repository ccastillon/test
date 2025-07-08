export function diff_years(dateOfBirth: Date) {
  const currentDate = new Date();
  // Calculate the difference in milliseconds between the two dates
  var diff = (currentDate.getTime() - dateOfBirth.getTime()) / 1000;
  // Convert the difference from milliseconds to days
  diff /= 60 * 60 * 24;
  // Calculate the approximate number of years by dividing the difference in days by the average number of days in a year (365.25)
  return Math.abs(diff / 365.25);
}
