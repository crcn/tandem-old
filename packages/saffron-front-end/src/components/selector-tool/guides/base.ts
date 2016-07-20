
class BaseGuide {

  snap(left, top) {
    return { left, top };
  }

  intersects() {
    return false;
  }
}

export default BaseGuide;
