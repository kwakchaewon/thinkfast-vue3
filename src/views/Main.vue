<template>
  <v-container class="pb-16">
    <!-- 상단 앱바 -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>ThinkFast</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <!-- 알림 버튼 -->
      <v-badge
        :content="notifications.length"
        :model-value="notifications.length > 0"
        color="error"
      >
        <v-btn icon @click="notificationMenu = true">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>

      <!-- 알림 메뉴 -->
      <v-menu
        v-model="notificationMenu"
        :close-on-content-click="false"
        location="bottom end"
      >
        <v-card min-width="300" class="notification-menu">
          <v-list>
            <v-list-subheader>알림</v-list-subheader>
            <v-list-item
              v-for="notification in notifications"
              :key="notification.id"
              :title="notification.title"
              :subtitle="notification.message"
            >
              <template v-slot:prepend>
                <v-icon :color="notification.color">{{ notification.icon }}</v-icon>
              </template>
            </v-list-item>
            <v-list-item v-if="notifications.length === 0">
              <v-list-item-title class="text-center text-subtitle-1">
                새로운 알림이 없습니다
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- 메인 컨텐츠 -->
    <v-row class="mt-16 pt-8">
      <!-- 주요 액션 버튼 -->
      <v-col cols="12" class="text-center mb-8">
        <v-btn
          color="primary"
          size="x-large"
          class="mx-2"
          prepend-icon="mdi-plus"
          @click="createSurvey"
        >
          설문 조사 생성하기
        </v-btn>
        <v-btn
          color="secondary"
          size="x-large"
          class="mx-2"
          prepend-icon="mdi-vote"
          @click="participateSurvey"
        >
          설문 조사 참여하기
        </v-btn>
      </v-col>

      <!-- 나의 설문 조사 섹션 -->
      <v-col cols="12">
        <v-tabs v-model="activeTab" color="primary" align-tabs="center">
          <v-tab value="created">내가 생성한 설문</v-tab>
          <v-tab value="participated">내가 참여한 설문</v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4">
          <!-- 내가 생성한 설문 -->
          <v-window-item value="created">
            <v-row>
              <v-col
                v-for="survey in createdSurveys"
                :key="survey.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card>
                  <v-card-title>{{ survey.title }}</v-card-title>
                  <v-card-subtitle>
                    생성일: {{ survey.createdAt }}
                  </v-card-subtitle>
                  <v-card-text>
                    <v-chip
                      :color="survey.status === 'active' ? 'success' : 'error'"
                      class="mb-2"
                    >
                      {{ survey.status === 'active' ? '진행중' : '종료됨' }}
                    </v-chip>
                    <div class="mt-2">응답수: {{ survey.responseCount }}개</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" color="primary">
                      결과 보기
                    </v-btn>
                    <v-btn variant="text" color="error">
                      설문 종료
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 내가 참여한 설문 -->
          <v-window-item value="participated">
            <v-row>
              <v-col
                v-for="survey in participatedSurveys"
                :key="survey.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card>
                  <v-card-title>{{ survey.title }}</v-card-title>
                  <v-card-subtitle>
                    참여일: {{ survey.participatedAt }}
                  </v-card-subtitle>
                  <v-card-text>
                    <v-chip
                      :color="survey.status === 'active' ? 'success' : 'info'"
                      class="mb-2"
                    >
                      {{ survey.status === 'active' ? '진행중' : '결과 확인 가능' }}
                    </v-chip>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" color="primary">
                      결과 보기
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
  <AppFooter />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    AppFooter
  },
  setup() {
    // 알림 관련 상태
    const notificationMenu = ref(false)
    const notifications = ref([
      {
        id: 1,
        title: '설문 종료',
        message: '"직장인 커피 소비 습관" 설문이 종료되었습니다.',
        icon: 'mdi-poll',
        color: 'primary'
      },
      {
        id: 2,
        title: '새로운 응답',
        message: '"독서 습관 조사" 설문에 새로운 응답이 있습니다.',
        icon: 'mdi-message-reply',
        color: 'success'
      }
    ])

    // 탭 상태
    const activeTab = ref('created')

    // 더미 데이터
    const createdSurveys = ref([
      {
        id: 1,
        title: '직장인 커피 소비 습관',
        createdAt: '2024-03-15',
        status: 'active',
        responseCount: 45
      },
      {
        id: 2,
        title: '재택근무 만족도 조사',
        createdAt: '2024-03-10',
        status: 'ended',
        responseCount: 120
      }
    ])

    const participatedSurveys = ref([
      {
        id: 1,
        title: '2024 트렌드 조사',
        participatedAt: '2024-03-14',
        status: 'active'
      },
      {
        id: 2,
        title: '독서 습관 조사',
        participatedAt: '2024-03-12',
        status: 'ended'
      }
    ])

    // 액션 메서드
    const createSurvey = () => {
      console.log('설문 생성 페이지로 이동')
    }

    const participateSurvey = () => {
      console.log('설문 참여 페이지로 이동')
    }

    return {
      notificationMenu,
      notifications,
      activeTab,
      createdSurveys,
      participatedSurveys,
      createSurvey,
      participateSurvey
    }
  }
})
</script>

<style scoped>
.notification-menu {
  max-height: 400px;
  overflow-y: auto;
}
</style> 