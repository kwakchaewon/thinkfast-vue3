<template>
  <div class="min-h-screen bg-background">
    <!-- 헤더 -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">게시물 목록</h1>
          <Button variant="outline" @click="refreshPosts">
            <RefreshCw class="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 검색 및 필터 -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="게시물 검색..."
            class="w-full pl-10"
          />
        </div>
        <Select v-model="selectedCategory">
          <SelectTrigger class="w-full sm:w-[180px]">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="tech">기술</SelectItem>
            <SelectItem value="design">디자인</SelectItem>
            <SelectItem value="business">비즈니스</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- 게시물 목록 -->
      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <FileText class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-muted-foreground">게시물이 없습니다.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="post in filteredPosts"
          :key="post.id"
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="viewPost(post)"
        >
          <CardHeader>
            <div class="flex items-start justify-between mb-2">
              <Badge :variant="getCategoryVariant(post.category)">
                {{ getCategoryName(post.category) }}
              </Badge>
              <span class="text-xs text-muted-foreground">
                {{ formatDate(post.createdAt) }}
              </span>
            </div>
            <CardTitle class="text-xl line-clamp-2">{{ post.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground line-clamp-3 mb-4">
              {{ post.content }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <User class="h-4 w-4" />
                <span>{{ post.author }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Eye class="h-4 w-4" />
                  <span>{{ post.views }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <MessageSquare class="h-4 w-4" />
                  <span>{{ post.comments }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <div class="flex items-center gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            variant="outline"
            :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </main>

    <!-- 게시물 상세 다이얼로그 -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div class="flex items-center justify-between mb-2">
            <Badge :variant="selectedPost ? getCategoryVariant(selectedPost.category) : 'default'">
              {{ selectedPost ? getCategoryName(selectedPost.category) : '' }}
            </Badge>
            <span class="text-xs text-muted-foreground">
              {{ selectedPost ? formatDate(selectedPost.createdAt) : '' }}
            </span>
          </div>
          <DialogTitle class="text-2xl">{{ selectedPost?.title }}</DialogTitle>
        </DialogHeader>
        <div class="py-4">
          <div class="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-2">
              <User class="h-4 w-4" />
              <span>{{ selectedPost?.author }}</span>
            </div>
            <Separator orientation="vertical" class="h-4" />
            <div class="flex items-center gap-1">
              <Eye class="h-4 w-4" />
              <span>{{ selectedPost?.views }}회 조회</span>
            </div>
            <Separator orientation="vertical" class="h-4" />
            <div class="flex items-center gap-1">
              <MessageSquare class="h-4 w-4" />
              <span>{{ selectedPost?.comments }}개 댓글</span>
            </div>
          </div>
          <Separator class="mb-4" />
          <div class="prose max-w-none">
            <p class="whitespace-pre-wrap text-foreground">{{ selectedPost?.content }}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isDialogOpen = false">닫기</Button>
          <Button>
            <Share2 class="h-4 w-4 mr-2" />
            공유하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  RefreshCw,
  FileText,
  User,
  Eye,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-vue-next'

interface Post {
  id: number
  title: string
  content: string
  author: string
  category: 'tech' | 'design' | 'business'
  views: number
  comments: number
  createdAt: string
}

// 더미 데이터
const posts = ref<Post[]>([
  {
    id: 1,
    title: 'Vue 3 Composition API 완벽 가이드',
    content: 'Vue 3의 Composition API를 활용하여 더 나은 코드 구조를 만드는 방법을 알아봅니다. Options API와의 차이점, 언제 사용해야 하는지, 그리고 실전 예제를 통해 배워보세요.',
    author: '김개발',
    category: 'tech',
    views: 1250,
    comments: 23,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: '모던 웹 디자인 트렌드 2024',
    content: '2024년 웹 디자인 트렌드를 정리했습니다. 미니멀리즘, 다크모드, 그리고 새로운 레이아웃 패턴들을 살펴보고, 실제 프로젝트에 적용하는 방법을 알아봅니다.',
    author: '이디자인',
    category: 'design',
    views: 890,
    comments: 15,
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    title: '스타트업 창업의 첫걸음',
    content: '스타트업을 시작하려는 분들을 위한 실용적인 가이드입니다. 아이디어 검증부터 초기 투자 유치까지, 각 단계별로 필요한 준비사항과 팁을 공유합니다.',
    author: '박창업',
    category: 'business',
    views: 2100,
    comments: 45,
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: 4,
    title: 'TypeScript로 안전한 프론트엔드 개발하기',
    content: 'TypeScript를 활용하여 타입 안전성을 확보하고 버그를 줄이는 방법을 알아봅니다. 실전 프로젝트에서 자주 만나는 패턴과 베스트 프랙티스를 공유합니다.',
    author: '김개발',
    category: 'tech',
    views: 1560,
    comments: 32,
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: 5,
    title: '색상 이론과 브랜딩',
    content: '효과적인 색상 선택이 브랜드 인식도에 미치는 영향을 분석합니다. 색상 심리학과 실제 브랜드 사례를 통해 색상이 사용자에게 주는 감정과 인상을 살펴봅니다.',
    author: '이디자인',
    category: 'design',
    views: 720,
    comments: 18,
    createdAt: '2024-01-11T11:30:00Z',
  },
  {
    id: 6,
    title: '원격 근무 환경에서의 생산성 향상',
    content: '원격 근무 시 팀 협업과 개인 생산성을 높이는 방법을 공유합니다. 도구 활용법, 커뮤니케이션 전략, 그리고 워크라이프 밸런스를 유지하는 팁을 제공합니다.',
    author: '박창업',
    category: 'business',
    views: 980,
    comments: 28,
    createdAt: '2024-01-10T13:20:00Z',
  },
])

const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const itemsPerPage = 6
const isDialogOpen = ref(false)
const selectedPost = ref<Post | null>(null)

const filteredPosts = computed(() => {
  let result = posts.value

  // 카테고리 필터
  if (selectedCategory.value !== 'all') {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
    )
  }

  // 페이지네이션
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = posts.value

  if (selectedCategory.value !== 'all') {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
    )
  }

  return Math.ceil(result.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getCategoryVariant = (category: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (category) {
    case 'tech':
      return 'default'
    case 'design':
      return 'secondary'
    case 'business':
      return 'outline'
    default:
      return 'default'
  }
}

const getCategoryName = (category: string): string => {
  switch (category) {
    case 'tech':
      return '기술'
    case 'design':
      return '디자인'
    case 'business':
      return '비즈니스'
    default:
      return category
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const viewPost = (post: Post) => {
  selectedPost.value = post
  isDialogOpen.value = true
  // 조회수 증가 (실제로는 API 호출)
  post.views++
}

const refreshPosts = () => {
  // 실제로는 API 호출
  console.log('게시물 새로고침')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

