<!--  -->
<script setup>
import useModelInfo from "./composable/useModelInfo";
import useAgentInfo from "./composable/useAgentInfo";
import useAgentService from "./composable/useAgentService";
import moment from "moment";
import { useSiteStore, useTemplateStore } from "@/stores";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import SubmitBtn from "@/views/aiSystem/components/button/SubmitBtn.vue";
import CreateAgentWindow from "./components/CreateAgentWindow.vue";
import EditAgentWindow from "./components/EditAgentWindow.vue";

const router = useRouter();
const siteStore = useSiteStore();
const loading = ref(false);
const createAgentDialogVisible = ref(false);
const editAgentDialogVisible = ref(false);
const pageSize = 10;
const currPage = ref(1);
const { models } = useModelInfo();
const { agentList, total, getPageData } = useAgentInfo(
  currPage.value,
  pageSize
);
const prompts = useTemplateStore().templateState.prompts;
const form = ref({
  id: "",
  name: "",
  model: "",
  weight: "",
  prompt: "",
});

function chat(agentId) {
  siteStore.setActiveAgentId(agentId);
  router.push("/aiSystem/chat");
}

function delAgent(agentId, _) {
  console.log(agentId,_);
  _();
  useAgentService.useDelAgent(agentId);
  retrieveNextPage(currPage.value);
}

function createAgent() {
  if (form.value.name === "" || form.value.model === "") {
    ElMessage({
      message: "请完善模型信息！",
      type: "error",
    });
    return;
  }
  useAgentService.useCreateAgent(form.value);
  createAgentDialogVisible.value = false;
  retrieveNextPage(currPage.value);
}

function editAgent() {
  useAgentService.useUpdateAgent(form.value);
  editAgentDialogVisible.value = false;
  retrieveNextPage(currPage.value);
}

function handleAdd() {
  Object.keys(form.value).forEach((key) => (form.value[key] = ""));
  createAgentDialogVisible.value = true;
}

function handleEdit(agentInfo) {
  form.value = {
    id: agentInfo.id,
    name: agentInfo.agentName,
    model: agentInfo.model,
    prompt: agentInfo.agentPersona,
    weight: agentInfo.weight || 0,
  };
  editAgentDialogVisible.value = true;
}

function retrieveNextPage(v) {
  loading.value = true;
  currPage.value = v;
  getPageData(v, pageSize);
  loading.value = false;
}
</script>

<template>
  <div class="view-container">
    <CreateAgentWindow
      :condition="createAgentDialogVisible"
      :form="form"
      :models="models"
      :prompts="prompts"
      @submit="createAgent"
      @close="createAgentDialogVisible = false"
    />
    <EditAgentWindow
      :condition="editAgentDialogVisible"
      :form="form"
      :prompts="prompts"
      @submit="editAgent"
      @close="editAgentDialogVisible = false"
    />
    <div class="header-panel">
      <div class="title">代理</div>
      <SubmitBtn @click="handleAdd">新增模型</SubmitBtn>
    </div>

    <el-table :data="agentList" style="width: 100%">
      <el-table-column prop="agentName" label="名称" width="180" align="center" />
      <el-table-column prop="model" label="模型" width="180" align="center" />
      <el-table-column prop="chatCount" label="聊天次数" align="center" />
      <el-table-column prop="lastRun" label="最近一次运行" align="center">
        <template #default="scope">
          <div>
            {{
              scope.row.lastRun
                ? moment(scope.row.lastRun).format("YYYY/MM/DD HH:mm:ss")
                : "Never"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="大小" align="center" />
      <el-table-column fixed="right" label="选项" min-width="120" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="chat(scope.row.id)">
            选择 
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)"
            >更改</el-button
          >
          <el-popconfirm
            width="220"
            :hide-after="0"
            :hide-icon="true"
            title="确定要删除模型？"
          >
            <template #reference>
              <el-button link type="primary" size="small">删除</el-button>
            </template>
            <template #actions="{ cancel, confirm }">
              <el-button size="small" @click="cancel">否</el-button>
              <el-button
                type="danger"
                size="small"
                @click="delAgent(scope.row.id, confirm)"
              >
                是
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="currPage"
          @current-change="retrieveNextPage"
        />
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header-panel{
  background: #9073f3;
  .title{
    font-size: 16px;
    color: #fff;
  }
}
.pagination{
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translate(0, -50%);
}


</style>
