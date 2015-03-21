// Copyright (c) 2015, Matan Bareket
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

function playedShim(timeHandler) {

  this.timeranges = [];
  var me = this;

  function length() {
    return me.timeranges.length;
  }

  function start(index) {
    return me.timeranges[index].start;
  }

  function end(index) {
    return me.timeranges[index].end;
  }

  function toArray() {
    return me.timeranges.slice(0);
  }

  var calculateTimeRanges = function(time) {
    // time = Math.floor(time);
    var insert = false;
    if (me.timeranges.length === 0) {
      me.timeranges.push({
        start: time,
        end: time
      });
    }

    for (var i = 0; i < me.timeranges.length; i++) {
      var end = me.timeranges[i].end;
      var start = me.timeranges[i].start;

      var delta = Math.round(time - end);

      if (delta === 0) {
        insert = false;
        continue;
      }

      if (delta === 1) {
        insert = false;
        me.timeranges[i].end += (time - end);

        if (me.timeranges[i + 1] !== undefined) {
          if (Math.floor(time) == Math.floor(me.timeranges[i + 1].start)) {
            me.timeranges[i].end = me.timeranges[i + 1].end;
            me.timeranges.splice(i + 1, 1);
          }
        }
        break;
      }

      if (delta >= 2) {
        insert = true;
      }

      if (time >= start && time <= end) {
        insert = false;
      }
    }

    if (insert) {
      me.timeranges.push({
        start: time,
        end: time
      });
    }

    me.timeranges.sort(function(a, b) {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    });
  };

  timeHandler.apply(this, [calculateTimeRanges]);

  return {
    start: start,
    end: end,
    length: length,
    toArray: toArray
  };
}
