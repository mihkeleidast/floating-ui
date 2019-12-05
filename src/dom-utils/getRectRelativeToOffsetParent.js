// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import unwrapVirtualElement from './unwrapVirtualElement';
import { isElement } from './instanceOf';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (
  element: Element | VirtualElement,
  isFixed: boolean = false
): Rect => {
  const unwrappedElement = unwrapVirtualElement(element);
  const rect = getBoundingClientRect(element);
  const scrollParentsScrollSum = getScrollSum(
    listScrollParents(unwrappedElement)
  );
  const directOffsetParent = getOffsetParent(unwrappedElement);
  const directOffsetParentRect =
    isElement(directOffsetParent) && !isFixed
      ? getBoundingClientRect(directOffsetParent)
      : { left: 0, top: 0 };

  const ancestorOffsetParents = isFixed ? [directOffsetParent] : [];
  let currentOffsetParent = directOffsetParent;

  while (isElement(currentOffsetParent)) {
    currentOffsetParent = getOffsetParent(currentOffsetParent);
    ancestorOffsetParents.push(currentOffsetParent);
  }

  const ancestorOffsetParentScrollSum = getScrollSum(ancestorOffsetParents);

  const width = rect.width;
  const height = rect.height;
  const x =
    rect.left +
    scrollParentsScrollSum.scrollLeft -
    ancestorOffsetParentScrollSum.scrollLeft -
    directOffsetParentRect.left;
  const y =
    rect.top +
    scrollParentsScrollSum.scrollTop -
    ancestorOffsetParentScrollSum.scrollTop -
    directOffsetParentRect.top;

  return { width, height, x, y };
};
