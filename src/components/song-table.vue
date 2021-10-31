<script>
import ElTable from "element-ui/lib/table";
import { mapMutations, mapActions, mapState } from "@/store/helper/music";
import { pad } from "@/utils";

export default {
  props: {
    hideColumns: {
      type: Array,
      default: () => [],
    },
    songs: {
      type: Array,
      default: () => [],
    },
    highlightText: {
      type: String,
      default: "",
    },
    // 名字下面渲染的额外内容
    renderNameDesc: {
      type: Function,
    },
  },
  data() {
    const commonHighLightSlotScopes = {
      default: (scope) => {
        const text = scope.row[scope.column.property];
        return (
          <HighlightText
            class="song-table-name"
            text={text}
            highlightText={this.highlightText}
          />
        );
      },
    };
    return {
      columns: [
        {
          prop: "index",
          label: "",
          width: "35",
          scopedSlots: {
            default: (scope) => {
              return (
                <div class="index-wrap">
                  {false ? (
                    <Icon class="horn" type="aixin" color="theme" />
                  ) : (
                    // 补上左边的0
                    <span>{pad(scope.$index + 1)}</span>
                  )}
                </div>
              );
            },
          },
        },
        {
          prop: "love",
          label: "",
          width: "60",
          scopedSlots: {
            default: (scope) => {
              return (
                <div class="icon-wrap">
                  <Icon type="aixin" />
                  <Icon type="xiazai1" class="download" size={13} />
                </div>
              );
            },
          },
        },
        {
          prop: "name",
          label: "音乐标题",
          className: "title-td",
          scopedSlots: {
            default: (scope) => {
              return (
                <div class="song-table-name-cell">
                  {commonHighLightSlotScopes.default(scope)}
                </div>
              );
            },
          },
        },
        {
          prop: "artistsText",
          label: "歌手",
          scopedSlots: commonHighLightSlotScopes,
        },
        {
          prop: "albumName",
          label: "专辑",
          scopedSlots: commonHighLightSlotScopes,
        },
        {
          prop: "durationSecond",
          label: "时长",
          width: "100",
          scopedSlots: {
            default: (scope) => {
              return (
                <span>{this.$utils.formatTime(scope.row.durationSecond)}</span>
              );
            },
          },
        },
      ],
    };
  },

  mounted() {},

  methods: {
    onRowClick(song) {
      this.startSong(song);
      this.setPlaylist(this.songs);
    },
    isActiveSong(song) {
      return song.id === this.currentSong.id;
    },
    tableCellClassName(args) {
      // console.log("args", args);
      const { row, columnIndex } = args;
      const cellClassNameProp = this.$attrs.cellClassName;
      let retCls = [];
      // 执行外部传入的方法
      if (cellClassNameProp) {
        const propRet = cellClassNameProp(args);
        if (propRet) {
          retCls.push(propRet);
        }
      }
      if (
        this.isActiveSong(row) &&
        columnIndex ===
          this.showColumns.findIndex(({ prop }) => prop === "name")
      ) {
        console.log("active", row);
        retCls.push("song-active");
      }
      // console.log(retCls);
      return retCls.join(" ");
    },
    ...mapActions(["startSong"]),
    ...mapMutations(["setPlaylist"]),
  },
  computed: {
    ...mapState(["currentSong"]),
    showColumns() {
      const hideColumns = this.hideColumns.slice();
      if (hideColumns.length) {
        this.columns.map((column) => {
          // console.log(column, "colum");
          column.label = "";
        });
      }

      return this.columns.filter((column) => {
        return !hideColumns.find((hideColumn) => hideColumn === column.prop);
      });
    },
  },
  render() {
    const elTableProps = ElTable.props;
    const { props, attrs } = genPropsAndAttrs(this.$attrs, elTableProps);
    const tableAttrs = {
      attrs,
      on: {
        ...this.$listeners,
        ["row-dblclick"]: this.onRowClick,
      },
      props: {
        ...props,
        cellClassName: this.tableCellClassName,
        headerCellClassName: "title-th",
        data: this.songs,
      },
      style: { width: "99.9%" },
    };
    return this.songs.length ? (
      <el-table class="song-table" {...tableAttrs}>
        {this.showColumns.map((column, index) => {
          const { scopedSlots, ...columnProps } = column;
          return (
            <el-table-column
              key={index}
              props={columnProps}
              scopedSlots={scopedSlots} //具名插槽 https://github.com/vuejs/jsx#installation
            ></el-table-column>
          );
        })}
      </el-table>
    ) : null;
  },
};
function genPropsAndAttrs(rawAttrs, componentProps) {
  const props = {};
  const attrs = {};
  Object.keys(rawAttrs).forEach((key) => {
    const value = rawAttrs[key];
    if (componentProps.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      attrs[key] = value;
    }
  });
  return { props, attrs };
}
</script>

<style lang="scss" scoped>
.song-table {
  margin-top: 10px;
  @include no-select;
  .title-th {
    color: var(--font-color-grey2);
    font-weight: normal;
  }
  .title-td {
    color: var(--font-color-white);
  }
  .padding-space {
    padding-left: 24px;
  }
  .song-active {
    color: $theme-color;
    .high-light-text {
      color: $theme-color;
    }
  }
  .index-wrap {
    text-align: center;
    color: var(--font-color-grey-shallow);
  }

  .icon-wrap {
    .download {
      margin-left: 7px;
    }
  }

  .high-light-text {
    color: $blue;
  }
  .song-table-name-cell {
    @include text-ellipsis;
    display: flex;
    align-items: center;
    flex: 0 0 24px;
    .song-table-name {
      overflow: hidden;
      @include text-ellipsis;
    }
    .mv-icon {
      width: 24px;
      margin-left: 4px;
    }
  }
}
</style>