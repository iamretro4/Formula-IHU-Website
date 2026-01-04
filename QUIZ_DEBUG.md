# Quiz EV/CV Selection and End Form Debugging

## Issue
The EV/CV selection and end-of-quiz inputs are not appearing.

## Expected Behavior

### EV/CV Selection
- Should appear in `PreQuizView` component
- Visible when `appState === 'ready'` OR `appState === 'waiting'`
- Located between Team Email and the Start Quiz button

### End Quiz Form
- Should appear after completing the quiz
- Visible when `appState === 'endForm'`
- Contains:
  - Preferred Team Number
  - Alternative Team Number
  - Fuel Type (for CV teams only)

## Debugging Steps

1. **Check Quiz State**
   - Open browser console
   - Check what `appState` is set to
   - Verify `quizData` exists and has questions

2. **Check PreQuizView**
   - The component should render when quiz is in 'ready' or 'waiting' state
   - Vehicle category dropdown should be visible
   - Check if there are any CSS issues hiding the element

3. **Check EndQuizForm**
   - Should appear after clicking "Submit Final Answers" in QuizView
   - `handleQuizComplete()` should set `appState` to 'endForm'
   - Check browser console for any errors

4. **Verify Quiz Data**
   - Questions should have `category` field set to 'common', 'EV', or 'CV'
   - Check Sanity to ensure questions have categories

## Common Issues

1. **Quiz not in correct state**
   - Quiz might be 'active' instead of 'ready'
   - Quiz might have already been submitted

2. **Questions not filtered**
   - If vehicleCategory is not set, all questions show
   - Filtering happens in both `handleStart()` and `QuizView`

3. **State not persisting**
   - Check localStorage for saved quiz progress
   - Clear localStorage and try again

## Files to Check

- `app/registration-tests/page.tsx` - Main quiz logic
- `app/registration-tests/components/PreQuizView.tsx` - EV/CV selection
- `app/registration-tests/components/EndQuizForm.tsx` - End form inputs
- `app/registration-tests/components/QuizView.tsx` - Quiz questions

## Quick Fix

If the components don't appear:
1. Clear browser cache and localStorage
2. Make sure quiz is active in Sanity
3. Check that questions have `category` field set
4. Verify `teamInfo.vehicleCategory` is being set correctly

